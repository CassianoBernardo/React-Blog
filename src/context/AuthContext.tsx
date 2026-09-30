import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('blog_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (usernameOrEmail: string, _password: string): Promise<boolean> => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users: AuthUser[] = await res.json();
    const found = users.find(
      u => u.username.toLowerCase() === usernameOrEmail.toLowerCase()
        || u.email.toLowerCase() === usernameOrEmail.toLowerCase()
    );
    if (found) {
      setUser(found);
      localStorage.setItem('blog_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blog_user');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
