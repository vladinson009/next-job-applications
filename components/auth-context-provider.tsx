'use client';

import { AuthUserSession } from '@/types/User';
import { createContext, PropsWithChildren, useContext } from 'react';

type AuthContextProps = { isAuth: boolean; user: AuthUserSession };
type AuthProviderProps = PropsWithChildren<AuthContextProps>;

const AuthContext = createContext<AuthContextProps>({
  isAuth: false,
  user: undefined,
});

export function AuthProvider({ isAuth, children, user }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ isAuth, user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
