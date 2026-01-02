import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FAB, Card, Text, Searchbar, IconButton } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { api } from "../../services/api";
import { AppStackParamList } from "../../routes/AppRoutes";

type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

export function ManagePostsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProps>();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Função para carregar posts usando a instância da API
  async function loadPosts(pageNumber = 1, shouldRefresh = false) {
    if (loading || (!hasMore && !shouldRefresh)) return;

    setLoading(true);
    try {
      // Usando a instância 'api' configurada com baseURL e Token
      const response = await api.get(`/posts?page=${pageNumber}&limit=5`);
      const result = response.data;
      const newPosts = result.data || [];

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => {
          // Se for refresh (foco na tela), substitui a lista. Se não, concatena.
          const currentList = shouldRefresh ? [] : prev;
          const all = [...currentList, ...newPosts];

          // Remove duplicados por ID
          return all.filter(
            (post, index, self) =>
              index === self.findIndex((p) => p._id === post._id)
          );
        });
        setPage(pageNumber);
      }
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setLoading(false);
    }
  }

  // Hook que dispara toda vez que a tela ganha foco (ex: ao voltar de criar/editar)
  useFocusEffect(
    useCallback(() => {
      setHasMore(true);
      loadPosts(1, true); // Recarrega do zero
    }, [])
  );

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleDelete(postId: string) {
    Alert.alert(
      "Excluir Post",
      "Tem certeza que deseja remover esta postagem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/posts/${postId}`);
              // Atualiza o estado local imediatamente
              setPosts((prev) => prev.filter((p) => p._id !== postId));
              Alert.alert("Sucesso", "Post removido com sucesso.");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar o post.");
            }
          },
        },
      ]
    );
  }

  function handleEdit(post: any) {
    navigation.navigate("PostForm", { post });
  }

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
        data={filteredPosts}
        keyExtractor={(item) => item._id}
        style={{ width: "100%" }}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() =>
              navigation.navigate("PostDetails", { postId: item._id })
            }
          >
            <Card.Cover
              source={{ uri: `https://picsum.photos/700?random=${item._id}` }}
            />
            <Card.Title title={item.title} subtitle={`Autor: ${item.author}`} />

            <Card.Content>
              <Text variant="bodyMedium" numberOfLines={2}>
                {item.summary || item.content}
              </Text>
            </Card.Content>

            {user?.role === "PROFESSOR" && (
              <Card.Actions>
                <IconButton
                  icon="pencil"
                  iconColor="#6200ee"
                  size={24}
                  onPress={() => handleEdit(item)}
                />
                <IconButton
                  icon="trash-can"
                  iconColor="#B00020"
                  size={24}
                  onPress={() => handleDelete(item._id)}
                />
              </Card.Actions>
            )}
          </Card>
        )}
        onEndReached={() => loadPosts(page + 1)}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#6200ee"
              style={{ margin: 20 }}
            />
          ) : null
        }
      />

      {user?.role === "PROFESSOR" && (
        <FAB
          icon="plus"
          style={styles.fab}
          label="Novo Post"
          color="white"
          onPress={() => navigation.navigate("PostForm", { post: undefined })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    width: "100%",
    backgroundColor: "#fff",
    elevation: 4,
    zIndex: 1,
  },
  search: {
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
    width: "100%",
    elevation: 2,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
});
