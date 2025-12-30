import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Text, ActivityIndicator, Card, Chip } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { api } from "../../services/api";

type Role = "PROFESSOR" | "ESTUDANTE";

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
    } catch (err) {
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

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text variant="titleLarge">Gerenciar Usuários</Text>

      {/* Filter Chips */}
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <Chip selected={filter === "TODOS"} onPress={() => setFilter("TODOS")}>
          Todos
        </Chip>
        <Chip selected={filter === "PROFESSOR"} onPress={() => setFilter("PROFESSOR")}>
          Professores
        </Chip>
        <Chip selected={filter === "ESTUDANTE"} onPress={() => setFilter("ESTUDANTE")}>
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
              <Text>Nenhum usuário encontrado.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card>
              <Card.Title
                title={item.name}
                subtitle={`${item.email} • ${item.role}`}
              />
            </Card>
          )}
        />
      )}
    </View>
  );
}
