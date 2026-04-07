# Documentação do Projeto - Taça das Casas

## Equipe

- Cauê
- Caio
- Luiz

## Links do Projeto

- **Site:** [tacadascasas.duckdns.org](https://tacadascasas.duckdns.org)
- **Repositório GitHub:** [app-taca-casas](https://github.com/Catadordegames/AppTacaCasas)

## Introdução

O projeto **Taça das Casas** consiste em uma aplicação web com suporte ao formato **Web App (PWA)**, desenvolvida sob a abordagem *Mobile First*, destinada a auxiliar a instituição de ensino **CEF 102 Norte** no gerenciamento operacional de suas gincanas escolares internas. A ferramenta digitaliza o acompanhamento do evento, oferecendo controle de pontuação, gestão de equipes e níveis de permissão por perfil de usuário. O sistema poderá ser acessado de qualquer dispositivo que possua um navegador de internet ou instalado como um aplicativo diretamente na tela inicial do celular.

---

## Descrição do problema identificado

No modelo atual, a gestão das gincanas no CEF 102 Norte baseia-se fortemente em métodos manuais — como uso de planilhas estáticas, anotações no whatsapp e divulgação de placares em murais. Essa abordagem analógica gera diversas dificuldades operacionais:

- Descentralização e lentidão na consolidação de pontos no fim de cada etapa ou dia.
- Falta de transparência em tempo real; os alunos não conseguem acompanhar suas colocações durante a ocorrência do evento.
- Alto risco de erros de contagem, extravio de anotações ou informações divergentes entre os docentes.
- Sobrecarga administrativa da equipe de coordenação que precisa recolher, apurar e unificar relatórios dispersos manualmente.

---

## Justificativa (por que essa solução é relevante?)

O desenvolvimento desta solução é altamente relevante por modernizar as práticas organizacionais do ambiente escolar, substituindo um sistema sujeito a falhas por uma ferramenta tecnológica precisa, rápida e de fácil uso. A aplicação promove autonomia e eficiência para os professores, que realizam os lançamentos na palma da mão através de seus celulares, minimizando o retrabalho da gestão escolar na consolidação dos dados.

Ademais, ao apresentar um ranking digital atualizado em tempo real, a ferramenta insere a gincana no cotidiano digital dos alunos, incentivando o engajamento estudantil e a competitividade saudável nas atividades propostas.

---

## Público-alvo

O sistema foi desenhado para atender às diferentes necessidades interativas da comunidade escolar do CEF 102 Norte, segmentado pelas seguintes permissões:

- **Coordenação / Diretoria (Administradores):** Necessitam de visão e controle gerencial completos do evento. Gerenciam os professores, validam as bases de alunos, turmas e casas (equipes), e podem criar ou corrigir parâmetros e lançamentos de forma irrestrita.
- **Professores:** Atuam como avaliadores e juízes das atividades, necessitando de um acesso ágil via celular para lançar pontos para as equipes em tempo real com sua própria autenticação.
- **Alunos, Pais e Comunidade Externa (Público Geral):** Participantes ou interessados que anseiam por informações rápidas e necessitam apenas visualizar o ranking geral dos competidores e seu acompanhamento diário.

---

## Proposta de solução (como o sistema irá resolver o problema)

Para mitigar os problemas atrelados aos métodos manuais e prover os benefícios propostos, o sistema disponibilizará um portal web interativo que resolverá as deficiências de gestão das seguintes formas:

1. **Interface do Placar Eletrônico e Dinâmico:** Substituição do quadro de avisos em papel através da exibição da tabela do campeonato em um endereço web acessível para qualquer pessoa (Público Geral), centralizando o canal de publicidade em tempo real.
2. **Painel do Professor Responsivo:** Um portal de controle otimizado para celulares, onde o professor autenticado consegue de forma prática lançar pontos para as casas, selecionando justificativas pré-estabelecidas e revisando seu próprio histórico de lançamentos para correção imediata de equívocos.
3. **Módulo de Administração Centralizada:** Uma área administrativa na qual a coordenação fará o CRUD (Criar, Ler, Atualizar, Deletar), garantindo o controle total sobre professores, alunos e configuração das equipes. Além disso, o sistema garante maior integridade dos dados, evitando lançamentos duplicados e eliminando a necessidade de somatórios manuais.
4. **Relatórios Automáticos e Transição Anual (Reset):** Ao invés de arquivar papéis, a plataforma implementa a possibilidade de extrair todas as métricas em planilhas digitais no formato CSV. Solucionando a continuidade do sistema de forma perene, haverá o recurso de encerramento de ciclos (*Reset Letivo*), facilitando as atividades para os anos letivos subsequentes em apenas um clique.

---
