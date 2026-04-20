# Paleta de Cores e Tema do Projeto

O projeto utiliza um **Tema Escuro (Midnight Blue / Azul Meia-Noite) com detalhes em Dourado (Primary)**, inspirado em uma estética elegante, mágica ou ligada à "Taça das Casas" (competição, prestígio). A paleta de cores adota nomes genéricos e foca em tons muito profundos de ardósia (slate/azul marinho) para os fundos (`background`) e elementos de estrutura, usando o dourado (`primary`) como cor principal para ações, foco e destaque.

Abaixo está o detalhamento das cores recém-migradas e como elas são aplicadas aos variados tipos de conteúdo.

---

## 💛 Tons Principais (`primary` - Antigo Gold)

Os tons principais (dourados) servem para os elementos principais de interação, chamadas para ação e para dar um aspecto visual "Premium" à aplicação.

- **`primary-500` (`#f59e0b`)**
  - **Uso:** Cor principal do sistema.
  - **Conteúdo:** Fundo do botão primário (`.btn-primary`), contorno (ring/border) de campos de input quando estão em foco, cor do "glow" (brilho irradiante radial) no fundo da página, e cor no "hover" (ao passar o mouse) da barra de rolagem.

- **`primary-600` (`#d97706`)**
  - **Uso:** Interação baseada no principal.
  - **Conteúdo:** Aplicado como a cor "hover" do botão primário, dando a sensação de clique e transição.

- **`primary-400` (`#fbbf24`) e `primary-300` (`#fde68a`)**
  - **Uso:** Foco secundário e brilho.
  - **Conteúdo:** Uso flexível para textos secundários em evidência, ícones, ou elementos de brilho na UI.

---

## 🌌 Tons de Fundo (`background` - Antigo Dark / Midnight Blue)

Essa paleta adotou o aspecto "Azul Meia-Noite" para não pesar tanto o ambiente como um "preto puro", mas ainda manter a atmosfera noturna/mágica viva.

- **`background-900` (`#0f172a`)**
  - **Uso:** Fundo Principal.
  - **Conteúdo:** Background de toda aplicação (a tag `body`), gerando o maior nível de contraste. Também é a cor do texto num botão dourado primário, para facilitar leitura tátil.

- **`background-800` (`#1e293b`)**
  - **Uso:** Cards e Superfícies.
  - **Conteúdo:** Background de todos os cartões (classes `.card`), destacando o conteúdo fora do fundo principal, e também fica presente como a trilha (*track*) da barra de rolagem.

- **`background-700` (`#334155`)**
  - **Uso:** Entradas (Inputs).
  - **Conteúdo:** Fundo dos campos de inserção de texto (`.input`), e plano de fundo dos "Toasts" (alertas do sistema).

- **`background-600` (`#475569`)**
  - **Uso:** Bordas Estruturais e Botões Secundários.
  - **Conteúdo:** Borda dos cards de conteúdo (`.card`), e o de fundo principal para botões secundários (`.btn-secondary`).

- **`background-500` (`#64748b`)**
  - **Uso:** Hover (Padrão) e Interações em Campos.
  - **Conteúdo:** Evento de hover em botões secundários, cor de borda dos inputs/campos inativos e visual básico do botão secundário. O *thumb* da barra de rolagem padrão também usa essa cor.

- **`background-400` (`#94a3b8`)**
  - **Uso:** Transição Leve / Hover.
  - **Conteúdo:** Aplicado ao fazer *hover* nas bordas de botões secundários e detalhes interativos.

---

## 🔴 Outras Cores Mapeadas no CSS (Tailwind nativas)

- **Vermelho (`red-600` / `red-700`)**
  - **Uso:** Alerta e Perigo.
  - **Conteúdo:** Botões destrutivos, denificados pela classe `.btn-danger` (deletar item, por exemplo).
  
- **Cinzas Claros e Branco / Transparências**
  - Textos principais utilizam a cor **`white`** para leitura e destaque completo das informações.
  - Textos menores de rótulos (labels) para inputs utilizam **`gray-300`**.
  - Textos de preenchimento inativos (placeholders) utilizam **`gray-500`**.
