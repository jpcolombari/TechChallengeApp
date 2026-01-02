import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Appbar,
  HelperText,
} from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { AppStackParamList } from "../../routes/AppRoutes";

type PostFormRouteProp = RouteProp<AppStackParamList, "PostForm">;

export function PostFormScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute<PostFormRouteProp>();

  const editingPost = route.params?.post;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      const fullText = editingPost.content || editingPost.summary || "";
      setContent(fullText);
    }
  }, [editingPost]);

  async function handleSave() {
    if (!title || !content) {
      Alert.alert("Erro", "Por favor, preencha o título e o conteúdo.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        content,
        summary: content,
        author: user?.name || user?.email,
      };

      if (editingPost) {
        // No modo edição, usamos PUT. O ID vai na URL.
        await api.put(`/posts/${editingPost._id}`, payload);
        Alert.alert("Sucesso", "Postagem atualizada!");
      } else {
        // No modo criação, usamos POST
        await api.post("/posts", payload);
        Alert.alert("Sucesso", "Postagem criada!");
      }

      navigation.goBack();
    } catch (error: any) {
      console.error("Erro ao salvar:", error.response?.data || error.message);
      Alert.alert(
        "Erro",
        "Não foi possível salvar o post. Verifique sua conexão ou permissão."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text variant="labelLarge" style={styles.authorTag}>
            Publicando como:{" "}
            <Text style={styles.authorName}>{user?.name || user?.email}</Text>
          </Text>

          <TextInput
            label="Título do Post"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <TextInput
            label="Conteúdo "
            value={content}
            onChangeText={setContent}
            mode="outlined"
            multiline={true}
            style={[styles.input, styles.textArea]}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            style={styles.button}
          >
            {editingPost ? "Salvar" : "Salvar"}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 20,
  },
  authorTag: {
    marginBottom: 20,
    color: "#666",
  },
  authorName: {
    fontWeight: "bold",
    color: "#6200ee",
  },
  title: {
    marginBottom: 20,
    color: "#6200ee",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  textArea: {
    minHeight: 250,
    maxHeight: 400,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
