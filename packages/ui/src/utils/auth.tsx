import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { User } from '@newordergame/common';

export type AuthContextType = {
  user: User | null;
  logIn: (user: User, callback?: VoidFunction) => void;
  logOut: (callback?: VoidFunction) => void;
};

export const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType
);

export function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);

  const logIn = (newUser: User, callback?: VoidFunction) => {
    logOut();
    setUser(newUser);
    if (typeof callback === 'function') {
      callback();
    }
  };

  const logOut = (callback?: VoidFunction) => {
    setUser(null);
    if (typeof callback === 'function') {
      callback();
    }
  };

  const value = { user, logIn, logOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  return React.useContext(AuthContext);
}
