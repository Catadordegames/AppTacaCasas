# 📊 Relatório do Google Lighthouse - Taça das Casas

> **Nota:** Este relatório foi sumarizado e organizado com base na extração bruta do Lighthouse gerada no ambiente local do desenvolvedor.

---

## 1. Visão Geral do Teste
A maioria dos avisos críticos de lentidão, execução de JavaScript e tempo de bloqueio (TBT/LCP) relatados no teste bruto **não são culpa do código da aplicação**. O Lighthouse foi executado em um navegador padrão onde extensões injetaram scripts pesados na página. 

**Extensões identificadas bloqueando a thread principal:**
- *Cuponomia* (`gidejehfgombmkfflghejpncblgfkagj`)
- *Kaspersky Protection* (`ahkjpbeeocnddjkakilopmfdlnjdpcdm`)
- *LanguageTool* (`oldceeleldhonbafppcapldpdifcinji`)

*Recomendação para testes de performance precisos:* Sempre execute o Lighthouse em uma **aba anônima** (sem extensões habilitadas) ou no modo *Guest* do Chrome.

---

## 2. Problemas Reais Identificados na Aplicação

### 🌐 SEO & Rastreamento (Crawling)
- **Robots.txt inválido (21 erros):** O Lighthouse tentou acessar `/robots.txt`, mas o arquivo não existe. Como o frontend usa React Router, o servidor (Vite/Nginx) fez o fallback redirecionando a requisição para o `index.html`. O Lighthouse tentou ler o HTML como se fosse um arquivo de texto de regras, gerando "Syntax not understood".

### ♿ Acessibilidade (A11y)
- **Baixo Contraste (Links rely on color to be distinguishable):** Os links do GitHub dos alunos no rodapé (`Cauê` e `Caio`) estão com a cor `text-gray-400` sobre o fundo `bg-background-800`. O contraste é baixo e dificulta a leitura para usuários com baixa visão.

### ⚡ Performance & Renderização
- **Preconnect não utilizado:** A tag `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />` foi sinalizada. Em algumas configurações atuais do Google Fonts, o uso dessa tag mudou ou não é estritamente necessário.
- **Pequeno Layout Shift (CLS - 0.029):** O elemento do rodapé (`footer`) sofre um pequeno "pulo" ao renderizar a tela.
- **Animações não compostas (Non-composited animations):** Transições CSS na propriedade `color` (usada no `:hover` dos links) exigem recálculo de pintura da CPU, o que não é o ideal para animações fluidas (embora seja aceitável para hover simples).

---

## 3. Sugestões de Correção (Plano de Ação)

Abaixo estão as soluções diretas para resolver os apontamentos reais do Lighthouse:

### Correção 1: Criar o arquivo `robots.txt` (Resolve o Erro de SEO)
Para evitar que o Vite devolva a página HTML quando os bots do Google buscarem as regras de rastreamento, crie um arquivo na pasta pública.

**Crie o arquivo:** `frontend/public/robots.txt`
**Conteúdo:**
```txt
User-agent: *
Allow: /
```

### Correção 2: Melhorar o Contraste no Rodapé (Resolve Acessibilidade)
Edite o arquivo `frontend/src/components/layout/Layout.jsx`. 
Troque a classe `text-gray-400` dos links por `text-gray-300` ou torne-os sublinhados nativamente, o que ajuda na identificação visual do link sem depender apenas da cor.
**Exemplo:** `className="text-gray-300 underline hover:text-primary-400"`

### Correção 3: Validar Links do Google Fonts (Otimização)
Verifique o `frontend/index.html`. Atualmente a recomendação oficial do Google Fonts é usar o preconnect corretamente. Verifique se as fontes `Cinzel` e `Nunito` estão realmente sendo utilizadas e carregadas com eficiência.

### Correção 4: Repetir o teste de Performance de forma Limpa
Após aplicar as correções acima, abra uma guia anônima (Ctrl+Shift+N) e rode o relatório do Lighthouse novamente. Você verá que os alertas de "Minimize main-thread work" e "Avoid long main-thread tasks" vão despencar, pois as extensões estarão desligadas.
