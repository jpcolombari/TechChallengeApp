import React, { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, RefreshControl, View } from "react-native";
import { Button, Text, ActivityIndicator, Card, Chip } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { api } from "../../services/api";

type Role = "PROFESSOR" | "STUDENT";

type ApiUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
};

type UsersResponse = {
  data: ApiUser[];
  total: number;
  page: number;
  lastPage: number;
};

type Filter = "TODOS" | Role;

export function ManageUsersScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [filter, setFilter] = useState<Filter>("TODOS");

  const filteredUsers = useMemo(() => {
    if (filter === "TODOS") return users;
    return users.filter((u) => u.role === filter);
  }, [users, filter]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<UsersResponse>("/users");
      setUsers(response.data?.data ?? []);
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Erro ao carregar usuários");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );

  const onCreate = useCallback(() => {
    navigation.navigate("UserForm", { mode: "create" });
  }, [navigation]);

  const onEdit = useCallback(
    (user: ApiUser) => {
      navigation.navigate("UserForm", { mode: "edit", user });
    },
    [navigation]
  );

  const onDelete = useCallback(
    (user: ApiUser) => {
      Alert.alert("Confirm delete", `Delete ${user.name}?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await api.delete(`/users/${user._id}`);
              await loadUsers();
            } catch (err: any) {
              Alert.alert("Error", err?.message ?? "Failed to delete user");
            } finally {
              setLoading(false);
            }
          },
        },
      ]);
    },
    [loadUsers]
  );

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Text variant="titleLarge">Gerenciar Usuários</Text>
        <View style={{ flex: 1 }} />
        <Button mode="contained" onPress={onCreate}>
          Novo
        </Button>
      </View>

      {/* Filter Chips */}
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <Chip selected={filter === "TODOS"} onPress={() => setFilter("TODOS")}>
          Todos
        </Chip>
        <Chip selected={filter === "PROFESSOR"} onPress={() => setFilter("PROFESSOR")}>
          Professores
        </Chip>
        <Chip selected={filter === "STUDENT"} onPress={() => setFilter("STUDENT")}>
          Estudantes
        </Chip>
      </View>

      {loading && users.length === 0 ? (
        <View style={{ paddingTop: 24 }}>
          <ActivityIndicator animating />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadUsers} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <Text>Nenhum Usuário Encontrado.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card>
              <Card.Title
                title={item.name}
                subtitle={`${item.email} • ${item.role === "PROFESSOR" ? "Professor" : "Estudante"}`}
              />
              <Card.Actions>
                <Button onPress={() => onEdit(item)}>Editar</Button>
                <Button textColor="crimson" onPress={() => onDelete(item)}>
                  Excluir
                </Button>
              </Card.Actions>
            </Card>
          )}
        />
      )}
    </View>
  );
}
