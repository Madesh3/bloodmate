import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAndCreateProfile(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAndCreateProfile(session.user);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAndCreateProfile = async (user: User) => {
    try {
      // First try to get the existing profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            is_admin: false
          });

        if (insertError) throw insertError;
        setIsAdmin(false);
      } else {
        setIsAdmin(profile.is_admin || false);
      }
    } catch (error) {
      console.error('Error managing profile:', error);
      toast.error("Failed to load user profile");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};