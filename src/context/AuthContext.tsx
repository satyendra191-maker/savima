
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

const DEMO_ACCOUNTS = [
  { email: 'satyendra191@gmail.com', password: 'saviman2024', role: 'super_admin', name: 'Satyendra', permissions: { products: true, inquiries: true, industries: true, blogs: true, settings: true, users: true, export: true, create: true, delete: true, update: true, read: true } },
];

interface AdminUser {
  id: string;
  email: string;
  role: string;
  name: string;
  permissions: {
    products: boolean;
    inquiries: boolean;
    industries: boolean;
    blogs: boolean;
    settings: boolean;
    users: boolean;
    export: boolean;
  };
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isDemoUser: boolean;
  demoRole: string | null;
  adminUser: AdminUser | null;
  permissions: Record<string, boolean>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [demoRole, setDemoRole] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const getDemoAccount = (email: string, password: string) => {
    return DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
  };

  useEffect(() => {
    // Check for persisted demo session
    const demoSession = sessionStorage.getItem('demo_session');
    if (demoSession) {
      const parsed = JSON.parse(demoSession);
      setIsDemoUser(true);
      setDemoRole(parsed.role);
      // Set permissions from demo account
      const demo = getDemoAccount(parsed.email, parsed.password);
      if (demo) {
        setAdminUser({
          id: 'demo-' + demo.email,
          email: demo.email,
          role: demo.role,
          name: demo.name,
          permissions: demo.permissions
        });
        setPermissions(demo.permissions as any);
      }
    }

    // Get initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Check if user is admin in Supabase
      if (session?.user) {
        checkSupabaseAdmin(session.user.email || '');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        checkSupabaseAdmin(session.user.email || '');
      } else {
        setAdminUser(null);
        setPermissions({});
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSupabaseAdmin = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      if (data && !error) {
        setAdminUser({
          id: data.id,
          email: data.email,
          role: data.role,
          name: data.name,
          permissions: data.permissions
        });
        setPermissions(data.permissions || {});
      }
    } catch (e) {
      console.log('Not a Supabase admin');
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError_internal('');

    // ── Demo Login Check (no Supabase needed) ──────────────────
    const demo = getDemoAccount(email, password);

    if (demo) {
      const demoData = { email: demo.email, role: demo.role };
      sessionStorage.setItem('demo_session', JSON.stringify(demoData));
      setIsDemoUser(true);
      setDemoRole(demo.role);
      setAdminUser({
        id: 'demo-' + demo.email,
        email: demo.email,
        role: demo.role,
        name: demo.name,
        permissions: demo.permissions
      });
      setPermissions(demo.permissions as any);
      setLoading(false);
      return; // ✅ Bypass Supabase entirely
    }

    // ── Real Supabase Login ────────────────────────────────────
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    // Check for admin in database
    if (!error && data.user) {
      await checkSupabaseAdmin(email);
    }

    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Try demo: admin@saviman.com / saviman2024');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please confirm your email address before signing in.');
      }
      throw error;
    }
  };

  // Internal helper – avoids circular ref
  const setError_internal = (_msg: string) => { };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/admin/dashboard',
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    setLoading(false);

    if (error) {
      if (error.message.includes('Provider')) {
        throw new Error('Google authentication is not configured. Use demo credentials instead.');
      }
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + '/admin/dashboard' },
    });
    setLoading(false);
    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('An account with this email already exists.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    // Clear demo session
    sessionStorage.removeItem('demo_session');
    setIsDemoUser(false);
    setDemoRole(null);
    setAdminUser(null);
    setPermissions({});
    // Also sign out from Supabase if there is a real session
    await supabase.auth.signOut();
    setLoading(false);
  };

  // isAdmin: true for demo admin or any profile with admin/super_admin role
  const isAdmin = isDemoUser ||
    adminUser !== null ||
    (adminUser?.role === 'super_admin' || adminUser?.role === 'admin') ||
    (() => {
      if (!user) return false;
      const userEmail = user.email?.toLowerCase() || '';
      return userEmail === 'satyendra191@gmail.com' || userEmail === 'admin@saviman.com';
    })();

  return (
    <AuthContext.Provider value={{
      session,
      user,
      isAdmin,
      loading,
      isDemoUser,
      demoRole,
      adminUser,
      permissions,
      signInWithEmail,
      signInWithGoogle,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
