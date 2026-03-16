# 📂 Scripts de Banco de Dados (Migrations)

Esta pasta é destinada ao armazenamento de scripts `.sql` para atualização da estrutura do banco de dados (migrations) a cada nova sprint.

## Regras

- Nunca sobrescreva o banco de dados de produção manualmente via exportação/importação total (dump completo).
- Para cada alteração no banco (como adicionar uma nova coluna `url_brasao`), crie um arquivo SQL (ex: `001_add_url_brasao.sql`) contendo as instruções exatas.
- Os desenvolvedores devem executar esses scripts na instância do servidor ou configurar ferramentas/ORMs que automatizem a migração sem afetar os dados existentes na base de produção.
