import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

// ── Types ─────────────────────────────────────────────────────────

export interface Business {
  id: string;
  owner_id: string;
  business_name: string | null;
  business_type: string | null;
  logo_url: string | null;
  owner_name: string | null;
  phone: string | null;
  email: string | null;
  gst_number: string | null;
  pan_number: string | null;
  currency: string;
  timezone: string;
  financial_year: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postal_code: string | null;
  invoice_prefix: string;
  invoice_number_format: string;
  tax_enabled: boolean;
  language: string;
  theme: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface BusinessContextValue {
  business: Business | null;
  businessLoading: boolean;
  businessError: string | null;
  onboardingCompleted: boolean;
  /** Call this after the wizard marks onboarding done so the guard updates immediately */
  setOnboardingCompleted: (value: boolean) => void;
  refetchBusiness: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessLoading, setBusinessLoading] = useState(true);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const fetchBusiness = useCallback(async () => {
    if (!user) {
      setBusinessLoading(false);
      return;
    }
    setBusinessLoading(true);
    setBusinessError(null);
    const { data, error } = await supabase
      .from("business")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error) {
      // Table may not exist yet (schema not run) — don't block the user
      setBusinessError(error.message);
      setOnboardingCompleted(true); // skip wizard if we can't fetch
    } else {
      setBusiness(data ?? null);
      setOnboardingCompleted(data?.onboarding_completed ?? false);
    }
    setBusinessLoading(false);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  return (
    <BusinessContext.Provider
      value={{
        business,
        businessLoading,
        businessError,
        onboardingCompleted,
        setOnboardingCompleted,
        refetchBusiness: fetchBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used inside <BusinessProvider>");
  return ctx;
}
