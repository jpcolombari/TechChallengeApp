import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../routes/AppRoutes';

type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

export function AdminDashboardScreen() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Painel Administrativo</Text>
      <Text style={styles.subtitle}>Gerencie o conteúdo e acesso do Blog</Text>
      
      {/* Botão para Gerenciar POSTAGENS (Dev 3) */}
      <Card style={styles.card} onPress={() => navigation.navigate('ManagePosts')}>
        <Card.Title 
          title="Gerenciar Postagens" 
          subtitle="Listar, editar ou excluir posts"
          left={(props) => <Button {...props} icon="file-document-edit" />}
        />
      </Card>

      {/* Botão para Gerenciar USUÁRIOS (Dev 4) */}
      <Card style={styles.card} onPress={() => navigation.navigate('ManageUsers')}>
        <Card.Title 
          title="Gerenciar Usuários" 
          subtitle="Cadastrar alunos e professores"
          left={(props) => <Button {...props} icon="account-group" />}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  title: { 
    textAlign: 'center', 
    fontWeight: 'bold',
    color: '#6200ee'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666'
  },
  card: { 
    marginBottom: 20,
    elevation: 4
  },
});