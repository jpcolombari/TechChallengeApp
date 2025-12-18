import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Avatar } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';

export function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={user?.name?.substring(0, 2).toUpperCase() || 'US'} />
        <Text variant="headlineMedium" style={styles.name}>{user?.name}</Text>
        <Text variant="bodyLarge" style={styles.role}>{user?.role}</Text>
        <Text variant="bodyMedium">{user?.email}</Text>
      </View>

      <Button mode="contained" onPress={signOut} buttonColor="#ff4444" icon="logout" style={styles.button}>
        Sair do App
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  name: { marginTop: 10, fontWeight: 'bold' },
  role: { color: 'gray', marginBottom: 5 },
  button: { marginTop: 20 }
});