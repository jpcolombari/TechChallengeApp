import React, { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

import { api } from "../../services/api";

type Role = "PROFESSOR" | "STUDENT";

type ApiUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
};

type CreatePayload = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type UpdatePayload = {
  name: string;
  email: string;
  role: Role;
  password?: string;
};

type RouteParams =
  | { mode: "create" }
  | { mode: "edit"; user: ApiUser };

export function UserFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = (route.params ?? { mode: "create" }) as RouteParams;

  const isEdit = params.mode === "edit";
  const editingUser = isEdit ? params.user : null;

  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState(editingUser?.name ?? "");
  const [email, setEmail] = useState(editingUser?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(editingUser?.role ?? "STUDENT");

  const [showPassword, setShowPassword] = useState(false);

  const screenTitle = useMemo(
    () => (isEdit ? "Editar Usuário" : "Criar Usuário"),
    [isEdit]
  );

  function validate(): string | null {
    if (!name.trim()) return "O nome é obrigatório.";
    if (!email.trim()) return "Email é obrigatório.";
    if (!email.includes("@")) return "Email parece inválido.";
    if (!role) return "Cargo é obrigatório.";

    if (!isEdit && !password.trim()) {
      return "A senha é obrigatória ao criar um usuário.";
    }

    return null;
  }

  async function onSubmit() {
    const error = validate();
    if (error) {
      Alert.alert("Validation", error);
      return;
    }

    setSubmitting(true);

    try {
      if (!isEdit) {
        const payload: CreatePayload = {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role, 
        };

        await api.post("/users", payload);
      } else {
        const payload: UpdatePayload = {
          name: name.trim(),
          email: email.trim(),
          role,
        };

        if (password.trim()) payload.password = password.trim();

        await api.put(`/users/${editingUser!._id}`, payload);
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text variant="titleLarge">{screenTitle}</Text>

      <TextInput
        label="Nome"
        mode="outlined"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label={isEdit ? "Senha (opcional)" : "Senha"}
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword((prev) => !prev)}
          />
        }
      />


      <Text variant="labelLarge">Cargo</Text>
      <SegmentedButtons
        value={role}
        onValueChange={(v) => setRole(v as Role)}
        buttons={[
          { value: "PROFESSOR", label: "Professor" },
          { value: "STUDENT", label: "Estudante" },
        ]}
      />

      <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          Cancelar
        </Button>

        <Button
          mode="contained"
          onPress={onSubmit}
          loading={submitting}
          disabled={submitting}
        >
          Salvar
        </Button>
      </View>
    </View>
  );
}
