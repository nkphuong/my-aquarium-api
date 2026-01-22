// Types for authentication service
export interface AuthResult {
  user: SupabaseUser;
  session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface SupabaseUser {
  id: string; // Supabase Auth ID
  email: string;
  user_metadata?: {
    fullname?: string;
  };
}
