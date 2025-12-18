import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ManagePostsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👷‍♂️ Área do DEV 3 (Editor)</Text>
      <Text style={styles.subtext}>
        Aqui você deve listar todos os posts (igual na Home),
        mas com botões de EDITAR e EXCLUIR em cada item.
      </Text>
      <Text style={styles.req}>
        (Requisito 9: Lista administrativa)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  text: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  subtext: { 
    textAlign: 'center', 
    marginBottom: 20,
    color: '#555' 
  },
  req: {
    color: 'red',
    fontWeight: 'bold'
  }
});