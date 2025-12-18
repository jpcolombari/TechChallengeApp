export enum UserRole {
  PROFESSOR = 'PROFESSOR',
  STUDENT = 'STUDENT',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  summary?: string; 
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}