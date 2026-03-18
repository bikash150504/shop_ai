import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopai_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('shopai_user', JSON.stringify(userData));
    localStorage.setItem('shopai_token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopai_user');
    localStorage.removeItem('shopai_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
