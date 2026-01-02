import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { FAB, Card, Text, Searchbar } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../routes/AppRoutes";
import { api } from "../../services/api";

type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProps>();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  async function loadPosts(pageNumber = 1, shouldRefresh = false) {
    if (loading || (!hasMore && !shouldRefresh)) return;

    if (shouldRefresh) setRefreshing(true);
    setLoading(true);

    try {
      const response = await api.get(`/posts?page=${pageNumber}&limit=5`);
      const newPosts = response.data.data || [];

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => {
          const baseList = shouldRefresh ? [] : prev;
          const combined = [...baseList, ...newPosts];
          return combined.filter(
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
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setHasMore(true);
      loadPosts(1, true);
    }, [])
  );

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (refreshing && posts.length === 0) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 10 }}>Carregando posts...</Text>
      </View>
    );
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
          </Card>
        )}
        onEndReached={() => loadPosts(page + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator
              size="large"
              color="#6200ee"
              style={{ marginVertical: 20 }}
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
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loadingCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    elevation: 4,
    zIndex: 1,
  },
  search: { backgroundColor: "#f0f0f0" },
  list: { padding: 16, paddingBottom: 100 },
  card: { marginBottom: 16, elevation: 2 },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
});
