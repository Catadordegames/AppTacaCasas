# 2026-04-20 - Corrigir Migrations

```mermaid
flowchart TD
    A[Inicio] --> B[Identificar problema no Docker DB name conflict]
    B --> C[Corrigir DB_NAME no docker-compose]
    C --> D[Substituir schema divergente pela copia fiel de sql/schema.sql]
    D --> E[Remover manual SQL parsing]
    E --> F[Injetar execution array nativo mysql2 multipleStatements]
    F --> G[Fim]
```

- [✅] Identificar problema no Docker DB name conflict
- [✅] Corrigir DB_NAME no docker-compose
- [✅] Remover statements perigosos (CREATE DATABASE/USE) de migrations
- [✅] Copiar `sql/schema.sql` como fonte da verdade em `001_create_schema.sql`
- [✅] Substituir parse manual por nativo de pool connection (multipleStatements) no runMigrations.js
- [✅] Finalizar documentação e changelog
