import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// 模拟用户数据
const mockUser = {
  id: '1',
  name: '张泽远',
  avatar: '/avatars/user1.jpg',
  email: 'zhang@example.com',
  notifications: 3,
  messages: 5,
  tokens: 1000, // 添加 tokens 字段
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(mockUser); // 默认使用模拟数据
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // 这里模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // 这里模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 