import { supabase } from '../lib/supabase';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Helper function to convert Supabase user to our User type
const mapSupabaseUser = (supabaseUser: any, role: 'client' | 'admin' = 'client'): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    phone: supabaseUser.user_metadata?.phone || supabaseUser.phone || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    role: supabaseUser.user_metadata?.role || role,
    createdAt: supabaseUser.created_at || new Date().toISOString(),
  };
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Login failed');
    }

    const user = mapSupabaseUser(data.user, data.user.user_metadata?.role || 'client');

    return {
      user,
      token: data.session.access_token,
    };
  },

  async register(data: RegisterData): Promise<AuthResponse | { needsConfirmation: true; email: string }> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone,
          role: data.email.includes('admin') ? 'admin' : 'client',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.user) {
      throw new Error('Registration failed');
    }

    // If email confirmation is required, session will be null
    if (!authData.session) {
      return {
        needsConfirmation: true,
        email: data.email,
      };
    }

    const user = mapSupabaseUser(authData.user, authData.user.user_metadata?.role || 'client');

    return {
      user,
      token: authData.session.access_token,
    };
  },

  async sendMagicLink(email: string): Promise<void> {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/magic-link`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async verifyMagicLink(tokenHash: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'email', // Use 'email' type for magic links
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Magic link verification failed');
    }

    const user = mapSupabaseUser(data.user, data.user.user_metadata?.role || 'client');

    return {
      user,
      token: data.session.access_token,
    };
  },

  async forgotPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async resetPassword(tokenHash: string, newPassword: string): Promise<void> {
    // First verify the token hash from the email link
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'recovery',
    });

    if (verifyError) {
      throw new Error(verifyError.message);
    }

    // Then update the password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    // First check for an existing session (this will use persisted session if available)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      return mapSupabaseUser(session.user, session.user.user_metadata?.role || 'client');
    }

    // If no session, try to get user (this will trigger refresh if token is expired)
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return mapSupabaseUser(user, user.user_metadata?.role || 'client');
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  getToken(): string | null {
    // This will be handled by Supabase session
    return null;
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    const response = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = mapSupabaseUser(session.user, session.user.user_metadata?.role || 'client');
        callback(user);
      } else {
        callback(null);
      }
    });
    // Supabase returns { data: { subscription } }
    return response.data.subscription;
  },
};
