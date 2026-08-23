import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: () => {},
});

const AUTH_STORAGE_KEY = 'galaxy_hotel_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username) {
          setUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Default master credentials for demo/local or customized via settings
    // In production, this verifies with api/auth.php
    if ((username === 'admin' && password === 'galaxy2026') || (username === 'letan' && password === '123456')) {
      const adminUser: AdminUser = {
        id: 'usr-1',
        username: username,
        name: username === 'admin' ? 'Quản Trị Viên (Admin)' : 'Lễ Tân Khách Sạn',
        role: username === 'admin' ? 'admin' : 'receptionist',
        token: 'token_' + Date.now(),
      };
      setUser(adminUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
      return { success: true };
    }

    // Check custom credentials in localStorage if user modified them in Admin Settings
    const customCreds = localStorage.getItem('galaxy_hotel_custom_creds');
    if (customCreds) {
      try {
        const creds = JSON.parse(customCreds);
        if (creds.username === username && creds.password === password) {
          const adminUser: AdminUser = {
            id: 'usr-custom',
            username: username,
            name: creds.name || 'Quản Lý Khách Sạn',
            role: 'admin',
            token: 'token_' + Date.now(),
          };
          setUser(adminUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
          return { success: true };
        }
      } catch (e) {
        // ignore
      }
    }

    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
