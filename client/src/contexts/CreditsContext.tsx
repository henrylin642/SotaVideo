import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";

export type UserPlan = 'plus' | 'pro' | 'full' | null;

interface CreditsContextType {
  credits: number;
  freeClaimed: boolean;
  loading: boolean;
  plan: UserPlan;
  claimFreeCredits: () => Promise<boolean>;
  spendCredits: (amount: number, description?: string, metadata?: Record<string, unknown>) => Promise<boolean>;
  purchasePlan: (planName: 'plus' | 'pro' | 'full', creditsPerMonth: number) => Promise<boolean>;
  cancelPlan: () => Promise<boolean>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

const ANON_ID_KEY = "sotavideo_anon_id";

function getOrCreateAnonId(): string {
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);
  const [freeClaimed, setFreeClaimed] = useState(false);
  const [plan, setPlan] = useState<UserPlan>(null);
  const [loading, setLoading] = useState(true);

  const loadCredits = useCallback(async () => {
    setLoading(true);
    try {
      if (user) {
        // Logged in: check credits record
        const { data, error } = await supabase
          .from("user_credits")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          // No record - check anonymous to merge
          const anonId = localStorage.getItem(ANON_ID_KEY);
          if (anonId) {
            const { data: anonData } = await supabase
              .from("user_credits")
              .select("*")
              .eq("anonymous_id", anonId)
              .single();

            if (anonData) {
              // Merge anonymous → user
              const { data: merged } = await supabase
                .from("user_credits")
                .update({ user_id: user.id, anonymous_id: null })
                .eq("anonymous_id", anonId)
                .select()
                .single();

              // Also update transactions
              await supabase
                .from("credit_transactions")
                .update({ user_id: user.id, anonymous_id: null })
                .eq("anonymous_id", anonId);

              if (merged) {
                setCredits(merged.credits);
                setFreeClaimed(merged.free_claimed);
                setPlan(merged.plan || null);
                setLoading(false);
                return;
              }
            }
          }
          // Create new record
          const { data: newRecord } = await supabase
            .from("user_credits")
            .insert({ user_id: user.id, credits: 0, free_claimed: false })
            .select()
            .single();
          if (newRecord) {
            setCredits(newRecord.credits);
            setFreeClaimed(newRecord.free_claimed);
            setPlan(newRecord.plan || null);
          }
        } else if (data) {
          setCredits(data.credits);
          setFreeClaimed(data.free_claimed);
          setPlan(data.plan || null);
        }
      } else {
        // Anonymous: check Supabase then localStorage
        const anonId = localStorage.getItem(ANON_ID_KEY);
        if (anonId) {
          const { data } = await supabase
            .from("user_credits")
            .select("*")
            .eq("anonymous_id", anonId)
            .single();
          if (data) {
            setCredits(data.credits);
            setFreeClaimed(data.free_claimed);
            setPlan(data.plan || null);
          } else {
            loadFromLocal();
          }
        } else {
          loadFromLocal();
        }
      }
    } catch (err) {
      console.error("Failed to load credits:", err);
      loadFromLocal();
    }
    setLoading(false);
  }, [user]);

  function loadFromLocal() {
    setCredits(parseInt(localStorage.getItem("sotavideo_credits") || "0", 10));
    setFreeClaimed(localStorage.getItem("sotavideo_free_claimed") === "true");
  }

  useEffect(() => {
    loadCredits();
  }, [loadCredits]);

  // Claim free credits via atomic RPC
  const claimFreeCredits = async (): Promise<boolean> => {
    if (freeClaimed) return false;

    try {
      if (user) {
        const { data, error } = await supabase.rpc("claim_free_credits", {
          p_user_id: user.id,
          p_anonymous_id: null,
          p_amount: 60,
        });
        if (error) throw error;
        if (data === -1) return false; // Already claimed
        setCredits(data);
        setFreeClaimed(true);
        localStorage.setItem("sotavideo_credits", String(data));
        localStorage.setItem("sotavideo_free_claimed", "true");
        return true;
      } else {
        const anonId = getOrCreateAnonId();
        const { data, error } = await supabase.rpc("claim_free_credits", {
          p_user_id: null,
          p_anonymous_id: anonId,
          p_amount: 60,
        });
        if (error) throw error;
        if (data === -1) return false;
        setCredits(data);
        setFreeClaimed(true);
        localStorage.setItem("sotavideo_credits", String(data));
        localStorage.setItem("sotavideo_free_claimed", "true");
        return true;
      }
    } catch (err) {
      console.error("RPC claim failed, using localStorage fallback:", err);
      // Fallback: localStorage only
      const newCredits = credits + 60;
      localStorage.setItem("sotavideo_credits", String(newCredits));
      localStorage.setItem("sotavideo_free_claimed", "true");
      setCredits(newCredits);
      setFreeClaimed(true);
      return true;
    }
  };

  // Spend credits via atomic RPC (row-locked, with transaction log)
  const spendCredits = async (
    amount: number,
    description = "",
    metadata: Record<string, unknown> = {}
  ): Promise<boolean> => {
    if (credits < amount) return false;

    try {
      if (user) {
        const { data, error } = await supabase.rpc("spend_credits", {
          p_user_id: user.id,
          p_amount: amount,
          p_description: description,
          p_metadata: metadata,
        });
        if (error) throw error;
        if (data < 0) return false; // -1 user not found, -2 insufficient
        setCredits(data);
        localStorage.setItem("sotavideo_credits", String(data));
        return true;
      } else {
        const anonId = localStorage.getItem(ANON_ID_KEY);
        if (anonId) {
          const { data, error } = await supabase.rpc("spend_credits_anon", {
            p_anonymous_id: anonId,
            p_amount: amount,
            p_description: description,
            p_metadata: metadata,
          });
          if (error) throw error;
          if (data < 0) return false;
          setCredits(data);
          localStorage.setItem("sotavideo_credits", String(data));
          return true;
        }
      }
    } catch (err) {
      console.error("RPC spend failed, using localStorage fallback:", err);
    }

    // Fallback: localStorage
    const newCredits = credits - amount;
    if (newCredits < 0) return false;
    localStorage.setItem("sotavideo_credits", String(newCredits));
    setCredits(newCredits);
    return true;
  };

  // Purchase a plan via atomic RPC
  const purchasePlan = async (planName: 'plus' | 'pro' | 'full', creditsPerMonth: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('purchase_plan', {
        p_user_id: user.id,
        p_plan: planName,
        p_credits_per_month: creditsPerMonth,
      });
      if (error) throw error;
      if (data < 0) return false;

      setCredits(data);
      setPlan(planName);
      localStorage.setItem('sotavideo_credits', String(data));
      return true;
    } catch (err) {
      console.error('Purchase plan failed:', err);
      return false;
    }
  };

  // Cancel plan: reset to STD
  const cancelPlan = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('user_credits')
        .update({ plan: null, plan_started_at: null, plan_credits_per_month: 0 })
        .eq('user_id', user.id);
      if (error) throw error;
      setPlan(null);
      return true;
    } catch (err) {
      console.error('Cancel plan failed:', err);
      return false;
    }
  };

  return (
    <CreditsContext.Provider value={{ credits, freeClaimed, loading, plan, claimFreeCredits, spendCredits, purchasePlan, cancelPlan }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
}
