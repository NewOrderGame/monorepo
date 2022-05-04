import * as React from "react";
import {Navigate, useLocation} from "react-router-dom";

export type User = {
  username: string;
  isAdmin: boolean;
};

export type AuthContextType = {
  user: User | null;
  signIn: (user: User, callback: VoidFunction) => void;
  signOut: (callback?: VoidFunction) => void;
};

export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export const fakeAuthProvider = (() => {

  return {
    signIn(user: User, callback: VoidFunction) {
      window.localStorage.setItem('user', JSON.stringify(user));
      setTimeout(callback, 100); // fake async
    },
    signOut(callback?: VoidFunction) {
      window.localStorage.removeItem('user');
      setTimeout(callback || (() => {
      }), 100);
    },
  };
})();

export function RequireAuth({children}: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{from: location}} replace/>;
  }
  return children;
}

export function AuthProvider({children}: { children: React.ReactNode }) {
  const storedUser: User = JSON.parse(window.localStorage.getItem('user') || '{}');

  const [user, setUser] = React.useState<User | null>(storedUser);

  const signIn = (newUser: User, callback: VoidFunction) => {
    return fakeAuthProvider.signIn(newUser, () => {
      setUser(newUser);
      callback();
    });
  };

  const signOut = (callback?: VoidFunction) => {
    return fakeAuthProvider.signOut(() => {
      setUser(null);
      callback && callback();
    });
  };

  const value = {user, signIn, signOut};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  return React.useContext(AuthContext);
}
