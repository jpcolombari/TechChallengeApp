# 📱 Tech Challenge - Fase 4 (Mobile App)

Aplicativo oficial do Tech Challenge, desenvolvido em **React Native com Expo**.
O objetivo é fornecer uma interface mobile robusta para o consumo e gestão do Blog da FIAP.

---

## 🛠️ Tecnologias Utilizadas

* **Core:** React Native (Expo SDK 50+), TypeScript.
* **Navegação:** React Navigation (Native Stack + Bottom Tabs).
* **Interface:** React Native Paper (Material Design).
* **Integração:** Axios (API REST).
* **Autenticação:** Context API + AsyncStorage + JWT Decode.

---

## 🚀 Setup do Projeto (Passo a Passo)

### 1. Pré-requisitos
* [Node.js (LTS)](https://nodejs.org/) instalado.
* App **Expo Go** instalado no celular (iOS ou Android) ou Simulador configurado.

### 2. Instalação
Clone o repositório e instale as dependências:

git clone <URL_DO_REPO>
cd tech-challenge-app
npm install

# Caso ocorra erro de peer dependencies, use:
# npm install --legacy-peer-deps

### 3. Rodando a Aplicação
Inicie o servidor Metro Bundler (o flag -c é importante para limpar cache de fontes/ícones):

npx expo start -c

* Aperte "s" para abrir no Simulador (Mac/Windows).
* Ou escaneie o QR Code com a câmera do seu celular (iPhone) ou app Expo Go (Android).

---

## 🔐 Credenciais de Teste

O sistema possui controle de acesso (RBAC). Use estas credenciais para testar os diferentes perfis e funcionalidades:

| Perfil | Email | Senha | Permissões |
| :--- | :--- | :--- | :--- |
| **Professor** | professor@fiap.com | Teste@123 | **Total:** Pode criar/editar posts, gerenciar usuários e acessar o Painel Admin. |
| **Aluno** | estudante@fiap.com | Teste@123 | **Leitura:** Apenas visualiza o feed, busca posts e acessa seu perfil. |

---

## 🏗️ Arquitetura e Estrutura

A estrutura foi desenhada para separar responsabilidades e facilitar o trabalho em equipe:

* **src/services/api.ts**:
    * Instância única do Axios configurada com a URL de produção.
    * **Interceptor Automático:** Injeta o Token JWT em todas as requisições. **Não crie outro axios.**
* **src/contexts/AuthContext.tsx**:
    * Gerencia o login/logout e persistência do token.
    * Disponibiliza o objeto `user` (com role) para toda a aplicação via hook `useAuth()`.
* **src/routes/**:
    * **Router.tsx**: O "porteiro". Se não tiver logado, mostra Login. Se tiver, mostra as Abas.
    * **MainTabs.tsx**: Configuração do menu inferior. Esconde a aba "Admin" se for Aluno.
* **src/screens/**:
    * Contém os arquivos "placeholder" para cada funcionalidade (Feed, Forms, Listas Admin).