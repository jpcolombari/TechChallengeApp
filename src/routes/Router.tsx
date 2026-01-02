import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

import { useAuth } from "../hooks/useAuth";
import { AuthStackParamList, AppStackParamList } from "./AppRoutes";

import { LoginScreen } from "../screens/Auth/LoginScreen";
import { MainTabs } from "./MainTabs";
import { PostFormScreen } from "../screens/App/PostFormScreen";
import { PostDetailsScreen } from "../screens/App/PostDetailsScreen";

import { ManageUsersScreen } from "../screens/App/ManageUsersScreen";
import { ManagePostsScreen } from "../screens/App/ManagePostsScreen";
import { UserFormScreen } from "../screens/App/UserFormScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

export function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <AppStack.Navigator screenOptions={{ title: "Tech Blog" }}>
          <AppStack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          <AppStack.Screen
            name="PostDetails"
            component={PostDetailsScreen}
            options={{ title: "Leitura" }}
          />
          <AppStack.Screen
            name="PostForm"
            component={PostFormScreen}
            options={({ route }) => ({
              title: route.params?.post ? "Editar Post" : "Novo Post",
            })}
          />

          {user.role === "PROFESSOR" && (
            <>
              <AppStack.Screen
                name="ManageUsers"
                component={ManageUsersScreen}
                options={{ title: "Gerenciar Usuários" }}
              />
              <AppStack.Screen
                name="ManagePosts"
                component={ManagePostsScreen}
                options={{ title: "Gerenciar Posts" }}
              />
              <AppStack.Screen
                name="UserForm"
                component={UserFormScreen}
                options={{ title: "Dados do Usuário" }}
              />
            </>
          )}
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
