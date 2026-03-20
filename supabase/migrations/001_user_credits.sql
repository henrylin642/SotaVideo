-- Supabase SQL: 建立積分系統（含流水表和原子操作）
-- 請在 Supabase Dashboard → SQL Editor 執行此腳本

-- ==========================================
-- 1. user_credits 餘額表
-- ==========================================
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymous_id TEXT,
  credits INTEGER DEFAULT 0,
  free_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(anonymous_id)
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credits" ON user_credits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own credits" ON user_credits
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anonymous can read own credits" ON user_credits
  FOR SELECT USING (anonymous_id IS NOT NULL);
CREATE POLICY "Anonymous can insert" ON user_credits
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anonymous can update own credits" ON user_credits
  FOR UPDATE USING (anonymous_id IS NOT NULL);

-- ==========================================
-- 2. credit_transactions 流水表
-- ==========================================
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('free_claim', 'purchase', 'spend', 'refund')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert transactions" ON credit_transactions
  FOR INSERT WITH CHECK (true);

-- 索引加速查詢
CREATE INDEX IF NOT EXISTS idx_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_anon ON credit_transactions(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON credit_transactions(created_at DESC);

-- ==========================================
-- 3. 自動更新 updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- 4. 原子扣款 RPC: spend_credits
-- 使用行鎖防止並發問題
-- ==========================================
CREATE OR REPLACE FUNCTION spend_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT DEFAULT '',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS INTEGER AS $$
DECLARE
  v_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- 行鎖：鎖定該用戶的積分記錄
  SELECT credits INTO v_balance
    FROM user_credits
    WHERE user_id = p_user_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RETURN -1; -- 用戶不存在
  END IF;

  IF v_balance < p_amount THEN
    RETURN -2; -- 餘額不足
  END IF;

  v_new_balance := v_balance - p_amount;

  -- 更新餘額
  UPDATE user_credits
    SET credits = v_new_balance
    WHERE user_id = p_user_id;

  -- 寫入流水
  INSERT INTO credit_transactions (user_id, type, amount, balance_after, description, metadata)
    VALUES (p_user_id, 'spend', -p_amount, v_new_balance, p_description, p_metadata);

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. 原子扣款 RPC (匿名用戶版本)
-- ==========================================
CREATE OR REPLACE FUNCTION spend_credits_anon(
  p_anonymous_id TEXT,
  p_amount INTEGER,
  p_description TEXT DEFAULT '',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS INTEGER AS $$
DECLARE
  v_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  SELECT credits INTO v_balance
    FROM user_credits
    WHERE anonymous_id = p_anonymous_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RETURN -1;
  END IF;

  IF v_balance < p_amount THEN
    RETURN -2;
  END IF;

  v_new_balance := v_balance - p_amount;

  UPDATE user_credits
    SET credits = v_new_balance
    WHERE anonymous_id = p_anonymous_id;

  INSERT INTO credit_transactions (anonymous_id, type, amount, balance_after, description, metadata)
    VALUES (p_anonymous_id, 'spend', -p_amount, v_new_balance, p_description, p_metadata);

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 6. 原子領取免費積分 RPC
-- ==========================================
CREATE OR REPLACE FUNCTION claim_free_credits(
  p_user_id UUID DEFAULT NULL,
  p_anonymous_id TEXT DEFAULT NULL,
  p_amount INTEGER DEFAULT 60
)
RETURNS INTEGER AS $$
DECLARE
  v_record user_credits%ROWTYPE;
  v_new_balance INTEGER;
BEGIN
  IF p_user_id IS NOT NULL THEN
    -- 已登入用戶
    SELECT * INTO v_record FROM user_credits WHERE user_id = p_user_id FOR UPDATE;

    IF NOT FOUND THEN
      -- 建立新記錄
      INSERT INTO user_credits (user_id, credits, free_claimed)
        VALUES (p_user_id, p_amount, true);
      INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
        VALUES (p_user_id, 'free_claim', p_amount, p_amount, '註冊免費積分');
      RETURN p_amount;
    END IF;

    IF v_record.free_claimed THEN
      RETURN -1; -- 已領取過
    END IF;

    v_new_balance := v_record.credits + p_amount;
    UPDATE user_credits SET credits = v_new_balance, free_claimed = true WHERE user_id = p_user_id;
    INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
      VALUES (p_user_id, 'free_claim', p_amount, v_new_balance, '註冊免費積分');
    RETURN v_new_balance;

  ELSIF p_anonymous_id IS NOT NULL THEN
    -- 匿名用戶
    SELECT * INTO v_record FROM user_credits WHERE anonymous_id = p_anonymous_id FOR UPDATE;

    IF NOT FOUND THEN
      INSERT INTO user_credits (anonymous_id, credits, free_claimed)
        VALUES (p_anonymous_id, p_amount, true);
      INSERT INTO credit_transactions (anonymous_id, type, amount, balance_after, description)
        VALUES (p_anonymous_id, 'free_claim', p_amount, p_amount, '免費體驗積分');
      RETURN p_amount;
    END IF;

    IF v_record.free_claimed THEN
      RETURN -1;
    END IF;

    v_new_balance := v_record.credits + p_amount;
    UPDATE user_credits SET credits = v_new_balance, free_claimed = true WHERE anonymous_id = p_anonymous_id;
    INSERT INTO credit_transactions (anonymous_id, type, amount, balance_after, description)
      VALUES (p_anonymous_id, 'free_claim', p_amount, v_new_balance, '免費體驗積分');
    RETURN v_new_balance;

  ELSE
    RETURN -3; -- 無有效 ID
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
