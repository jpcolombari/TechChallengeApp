import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { FAB, Card, Text, Searchbar } from "react-native-paper";
import { useAuth } from "../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../routes/AppRoutes";

type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProps>();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function loadPosts(pageNumber = 1) {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://techchallengeblog.onrender.com/posts?page=${pageNumber}&limit=3`
      );
      const result = await response.json();
      const newPosts = result.data || [];

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => {
          const all = [...prev, ...newPosts];
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

  useEffect(() => {
    loadPosts(1);
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                {item.summary}
              </Text>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.list}
        onEndReached={() => loadPosts(page + 1)} // 👈 carrega mais ao rolar
        onEndReachedThreshold={0.5} // dispara quando chega a 50% do fim
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#6200ee" /> : null
        }
      />

      {user?.role === "PROFESSOR" && (
        <FAB
          icon="plus"
          style={styles.fab}
          label="Novo Post"
          onPress={() => navigation.navigate("PostForm", {})}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  header: { padding: 16, backgroundColor: "#fff", elevation: 2 },
  search: { backgroundColor: "#f0f0f0" },
  list: { padding: 16, paddingBottom: 80 },
  card: { marginBottom: 16 },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200ee",
  },
});
