import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'; 
import { api } from '../services/api';
import { AuthResponse, User, UserRole } from '../types';

interface AuthContextData {
  user: User | null; 
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean; 
}

interface AuthProviderProps {
  children: ReactNode;
}

interface JwtPayload {
  sub: string;       
  username: string;  
  role: UserRole;    
  exp: number; 
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@auth_user');
      const storageToken = await AsyncStorage.getItem('@auth_token');

      if (storageUser && storageToken) {
        api.defaults.headers.Authorization = `Bearer ${storageToken}`;
        setUser(JSON.parse(storageUser));
      }
      
      setIsLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(email: string, pass: string) {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password: pass,
    });

    const { access_token } = response.data;

    const decoded = jwtDecode<JwtPayload>(access_token);

    const loggedUser: User = {
      _id: decoded.sub,
      name: 'Usuário',
      email: decoded.username,
      role: decoded.role,
    };

    await AsyncStorage.setItem('@auth_user', JSON.stringify(loggedUser));
    await AsyncStorage.setItem('@auth_token', access_token);

    api.defaults.headers.Authorization = `Bearer ${access_token}`;

    setUser(loggedUser);
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};