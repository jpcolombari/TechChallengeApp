import { NavigatorScreenParams } from '@react-navigation/native';
import { Post, User } from '../types';

export type MainTabParamList = {
  Feed: undefined;
  AdminDashboard: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  
  PostDetails: { postId: string };
  PostForm: { post?: Post };
  
  ManageUsers: undefined;
  ManagePosts: undefined;
  UserForm: { user?: User };
};