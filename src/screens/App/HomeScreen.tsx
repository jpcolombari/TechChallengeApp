import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB, Card, Text, Searchbar } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../routes/AppRoutes';

type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProps>();
  const [searchQuery, setSearchQuery] = React.useState('');

  const fakePosts = [1, 2, 3]; 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar posts..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.search}
        />
      </View>

      <FlatList
        data={fakePosts}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('PostDetails', { postId: String(item) })}>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Title title={`Título do Post ${item}`} subtitle="Autor: João da Silva" />
            <Card.Content>
              <Text variant="bodyMedium" numberOfLines={2}>
                Aqui vai o resumo do post vindo do backend. O Dev 2 vai conectar isso com a API real.
              </Text>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />

      {user?.role === 'PROFESSOR' && (
        <FAB
          icon="plus"
          style={styles.fab}
          label="Novo Post"
          onPress={() => navigation.navigate('PostForm', {})}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  header: { padding: 16, backgroundColor: '#fff', elevation: 2 },
  search: { backgroundColor: '#f0f0f0' },
  list: { padding: 16, paddingBottom: 80 },
  card: { marginBottom: 16 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});