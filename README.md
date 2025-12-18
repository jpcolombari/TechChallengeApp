# 📱 Tech Challenge - Fase 4 (Mobile App)

Aplicativo oficial do Tech Challenge, desenvolvido em **React Native com Expo**.
O objetivo é fornecer uma interface mobile robusta para o consumo e gestão do Blog da FIAP.

---

## ⚠️ IMPORTANTE: API no Render (Leia antes de rodar!)

O Back-end desta aplicação está hospedado no plano gratuito do **Render**. Isso significa que o servidor **hiberna (dorme)** após 15 minutos de inatividade.

**Antes de testar o App, siga este passo para "acordar" o servidor:**
1. Abra seu navegador.
2. Acesse o Swagger da API: https://techchallengeblog.onrender.com/api
3. Aguarde a página carregar (pode levar até 1 minuto na primeira vez).
4. Quando o Swagger carregar, o servidor está acordado e o App funcionará rápido. Se você pular essa etapa, o Login dará erro de Timeout.

---

## 🛠️ Tecnologias Utilizadas

* **Core:** React Native (Expo SDK 50+), TypeScript.
* **Navegação:** React Navigation (Native Stack + Bottom Tabs).
* **Interface:** React Native Paper (Material Design).
* **Integração:** Axios (API REST).
* **Autenticação:** Context API + AsyncStorage + JWT Decode.

---

## 🚀 Setup do Ambiente (Windows, Mac e Linux)

Siga as instruções específicas para o seu Sistema Operacional.

### 1. Pré-requisitos (Para todos)
* **Node.js (Versão LTS):** Instale a versão "LTS" do site oficial do Node.js.
* **Git:** Instale o Git para clonar o repositório.
* **Celular Físico:** Baixe o app **"Expo Go"** na App Store (iOS) ou Play Store (Android). É a forma mais fácil de testar sem configurar emuladores pesados.

### 2. Instalação do Projeto
Abra o seu terminal (Terminal, PowerShell ou Git Bash) e rode os comandos abaixo na ordem:

# 1. Clone o repositório
git clone https://github.com/jpcolombari/TechChallengeApp.git

# 2. Entre na pasta do projeto
cd TechChallengeApp

# 3. Instale todas as dependências do projeto
# Isso vai baixar o React, o Expo e todas as bibliotecas que estamos usando.
npm install

# DICA: Se der erro de conflito de dependências (peer deps), use o comando abaixo:
# npm install --legacy-peer-deps

### 3. Rodando a Aplicação

**Para usuários de Mac 🍎:**
Você pode usar o Simulador do iPhone (se tiver XCode instalado) ou seu celular físico.

npx expo start -c

* Aperte "i" no teclado para abrir no Simulador iOS.
* Ou escaneie o QR Code com a câmera do seu iPhone.

**Para usuários de Windows / Linux 🪟🐧:**
A forma recomendada é usar o seu celular físico.

npx expo start -c

* Abra o app **Expo Go** no seu celular.
* Escaneie o QR Code que apareceu no terminal.
* **Nota:** Seu celular e o PC devem estar no mesmo Wi-Fi. Se der erro de conexão, pare o servidor e rode com o túnel:
npx expo start --tunnel

---

## 🔐 Credenciais de Teste

O sistema possui controle de acesso (RBAC). Use estas credenciais para testar os diferentes perfis:

| Perfil      | Email                | Senha       | Permissões                                                                 |
| :---        | :---                 | :---        | :---                                                                       |
| **Professor** | professor@fiap.com | Teste@123   | **Total:** Pode criar/editar posts, gerenciar usuários e acessar o Painel Admin. |
| **Aluno** | estudante@fiap.com | Teste@123   | **Leitura:** Apenas visualiza o feed, busca posts e acessa seu perfil.     |

---

## 🏗️ Arquitetura e Estrutura

A estrutura foi desenhada para separar responsabilidades e facilitar o trabalho em equipe:

* **src/services/api.ts**:
    * Instância única do Axios configurada com a URL de produção (Render).
    * **Interceptor:** Injeta o Token JWT automaticamente em todas as requisições. Não é necessário passar headers manualmente nas telas.

* **src/contexts/AuthContext.tsx**:
    * Gerencia o login/logout.
    * Decodifica o Token JWT para saber se o usuário é PROFESSOR ou STUDENT.
    * Disponibiliza o objeto `user` para toda a aplicação via hook `useAuth()`.

* **src/routes/**:
    * **Router.tsx**: Controla o fluxo principal. Se não tiver logado, mostra a pilha de Login. Se estiver logado, mostra as Abas principais.
    * **MainTabs.tsx**: Configura o menu inferior. Possui lógica condicional para esconder a aba de Admin caso o usuário seja Aluno.

* **src/screens/**:
    * **Auth/**: Telas públicas (Login).
    * **App/**: Telas privadas. Contém os arquivos base para cada funcionalidade (Feed, Forms, Listas Admin).

---

## 📱 Funcionalidades Implementadas

1.  **Autenticação Segura:** Login persistente (o usuário continua logado ao fechar o app).
2.  **Proteção de Rotas:** Alunos não conseguem acessar telas de criação de post ou gestão de usuários.
3.  **UI Padronizada:** Uso do React Native Paper para componentes visuais consistentes.