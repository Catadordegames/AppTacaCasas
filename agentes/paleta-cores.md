# 🎨 Paleta de Cores e Temas (Taça das Casas)

Este documento dita as diretrizes visuais e cores exatas em formato TailwindCSS utilizadas no projeto **Taça das Casas**.

> **🚨 IMPORTANTE PARA AGENTES 🚨**
> SEMPRE utilize estas classes predefinidas do Tailwind ao invés de cores padrão genéricas ou hexadecimais isolados. Toda nova estilização de frontend em views/components **deve** respeitar esse mapa para não quebrar a coesão. 

O arquivo fonte principal da configuração do esquema de temas encontra-se em: `frontend/tailwind.config.js`.
Outras definiões base ativas do design e classes comuns encontram-se em: `frontend/src/index.css`.

---

## 1. Tema Mestre e Contexto
O projeto adota iterativamente um **único tema** focado em design **Dark Mode Premium** com detalhes brilhantes em tons e luz dourada.
A interface foi projetada para ter harmonia sobre contrastes escuros baseados na paleta `dark` e luzes emitidas por objetos com classes `gold`.

## 2. Mapa de Cores Essenciais

### Fundos (Backgrounds Escuros Neutros)
| Classe Tailwind | Cor Original HEX | Uso Primário na UI |
| -- | -- | -- |
| `bg-dark-900` | `#0a0a0f` | Background principal da casca web (`body` e wrappers de toda tela login/dash) |
| `bg-dark-800` | `#12121a` | Background dos Cartões estáticos principais (`<Card>`, painéis centrais modais) |
| `bg-dark-700` | `#1a1a27` | Background de inputs textuais e selectores de formulários, blocos internos e barras invertíveis |
| `bg-dark-600` | `#252535` | Bordas/separadores divisores e coloração de fundo para `<Badge>` secundários ou inativos |
| `bg-dark-500` | `#32324a` | Hover styles para fundos estáticos `dark-600`, bordas focadas ativas em repouso secundárias |
| `bg-dark-400` | `#414160` | Pequenos detalhes neutros e pequenos relevos sobrepostos nas bases superiores de z-index |

### Destaque Principal da Interface (Dourado / Ouro)
O ouro é uma marca forte e primária deste sistema para botões interativos principais, títulos, focos e destaques visuais cruciais.
| Classe Tailwind | Cor Original HEX | Uso Primário na UI |
| -- | -- | -- |
| `text-gold-300` / `bg-gold-300` | `#fde68a` | Utilizado para efeitos sutis de gradiente vivo ou overlays translúcidos |
| `text-gold-400` / `bg-gold-400` | `#fbbf24` | **Fontes e Títulos Emissor de Marca** (ex: `h1`, `h2` principais nas chamadas de Views) e ícones de navegação puros ativos |
| `text-gold-500` / `bg-gold-500` | `#f59e0b` | **Botões Primários Submetedores** (Background sólido base `btn-primary`), furos/anéis de border em estados `focus:` globais |
| `text-gold-600` / `bg-gold-600` | `#d97706` | Sombreamentos e comportamento contínuo de gatilhos acionados (`hover:bg-gold-600`) |

### Tipografias Básicas (Escala de Cinza a Branco)
| Classe Tailwind | Uso Tipográfico e Descritivo na UI |
| -- | -- |
| `text-white` | Títulos secundários neutros e marcações ativas/texto padrão descritivo nos cartões |
| `text-gray-300` | Textos genéricos dos formulários (Labels associadas a `<Input>`) |
| `text-gray-400` | Detalhes semânticos suaves na UI e legendas explicativas medianas inativas |
| `text-gray-500` | Placeholders nos campos de texto e subtexto utilitário minimizado de acompanhamento descritivo |
| `text-gray-600` | Rodapés diminutos e textos inativos e minimizados extremos (`text-xs`) na navegação secundária |

### Elementos Semânticos Extras (Status / Ações / Feedbacks)
O sistema conta com formatação atrelada a lançamentos justificados:
| Classe Composicional | Significado da Regra de Negócio |
| -- | -- |
| `bg-green-500/10` c/ `text-green-400` | Marcação de **Pontuação POSITIVA** (Bônus, premiações na gincana, lançamentos >= 0). Ações bem sucedidas de admin |
| `border-green-500/30` | Borda luminosa de um Cartão indicando *Destaque/Saldo de equipe saudável e vencedor* |
| `bg-red-500/10` c/ `text-red-400` | Marcação de **Pontuação NEGATIVA** (Punições, infrações). Mensagens/Feedbacks de rejeição. |
| `border-red-500/30` | Borda luminosa de um Cartão demonstrando balanço de pontuações debaixo de meta ou perigoso |
| `bg-purple-900/60` c/ `text-purple-300` | Badge de diferenciação/crachá de um usuário que for "Admin/Coordenador" no painel de contas |

## 3. Miscelânea (Classes Padrões do `index.css`)
Sempre que pertinente, aplique utilitários globais pré-escritos para a criação de views padronizadas do repositório:
* **Botão Dourado Principal**: `@apply btn-primary` (contém `bg-gold-500 hover:bg-gold-600 text-dark-900...`)
* **Botão de Ação Neutra**: `@apply btn-secondary` (contém `bg-dark-600 hover:bg-dark-500...`)
* **Container Padronizado (Card)**: `@apply card` ou `bg-dark-800 border border-dark-600 rounded-xl p-5`
* **Campos de Input Form**: `@apply input` (contém transições do anel de foco `focus:border-gold-500`)
