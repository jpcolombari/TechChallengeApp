import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Card, Text } from "react-native-paper";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../routes/AppRoutes";

type PostDetailRouteProp = RouteProp<AppStackParamList, "PostDetails">;

type Props = {
  route: PostDetailRouteProp;
};

export function PostDetailsScreen({ route }: Props) {
  const { postId } = route.params;
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(
          `https://techchallengeblog.onrender.com/posts/${postId}`
        );
        const result = await response.json();
        setPost(result); // 👈 backend retorna o objeto do post
      } catch (error) {
        console.error("Erro ao buscar post:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text variant="bodyLarge">Post não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Cover
          source={{ uri: `https://picsum.photos/700?random=${post._id}` }}
        />
        <Card.Title title={post.title} subtitle={`Autor: ${post.author}`} />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.date}>
            Publicado em: {new Date(post.createdAt).toLocaleDateString("pt-BR")}
          </Text>
          <Text variant="bodyLarge" style={styles.content}>
            {post.content}
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  date: { marginBottom: 8, color: "#666" },
  content: { marginTop: 16, lineHeight: 22 },
});
