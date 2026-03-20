-- Supabase SQL: 購買方案功能
-- 請在 Supabase Dashboard → SQL Editor 執行此腳本

-- 1. 加入方案相關欄位
ALTER TABLE user_credits
  ADD COLUMN IF NOT EXISTS plan_started_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS plan_credits_per_month INTEGER DEFAULT 0;

-- 2. 購買方案 RPC（原子操作）
CREATE OR REPLACE FUNCTION purchase_plan(
  p_user_id UUID,
  p_plan TEXT,
  p_credits_per_month INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_record user_credits%ROWTYPE;
  v_new_balance INTEGER;
  v_plan_label TEXT;
BEGIN
  -- 驗證方案名稱
  IF p_plan NOT IN ('plus', 'pro', 'full') THEN
    RETURN -3; -- 無效方案
  END IF;

  -- 取得並鎖定用戶記錄
  SELECT * INTO v_record FROM user_credits WHERE user_id = p_user_id FOR UPDATE;

  IF NOT FOUND THEN
    -- 用戶不存在，建立記錄
    INSERT INTO user_credits (user_id, credits, free_claimed, plan, plan_started_at, plan_credits_per_month)
      VALUES (p_user_id, p_credits_per_month, false, p_plan, now(), p_credits_per_month);
    INSERT INTO credit_transactions (user_id, type, amount, balance_after, description, metadata)
      VALUES (p_user_id, 'purchase', p_credits_per_month, p_credits_per_month,
              '購買 ' || upper(p_plan) || ' 方案',
              jsonb_build_object('plan', p_plan, 'credits_per_month', p_credits_per_month));
    RETURN p_credits_per_month;
  END IF;

  -- 計算新餘額（加上方案積分）
  v_new_balance := v_record.credits + p_credits_per_month;

  -- 更新方案和積分
  UPDATE user_credits
    SET plan = p_plan,
        plan_started_at = now(),
        plan_credits_per_month = p_credits_per_month,
        credits = v_new_balance
    WHERE user_id = p_user_id;

  -- 寫入流水
  v_plan_label := CASE p_plan
    WHEN 'plus' THEN 'Plus'
    WHEN 'pro' THEN 'Pro'
    WHEN 'full' THEN 'Full'
  END;

  INSERT INTO credit_transactions (user_id, type, amount, balance_after, description, metadata)
    VALUES (p_user_id, 'purchase', p_credits_per_month, v_new_balance,
            '購買 ' || v_plan_label || ' 方案',
            jsonb_build_object('plan', p_plan, 'credits_per_month', p_credits_per_month));

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
