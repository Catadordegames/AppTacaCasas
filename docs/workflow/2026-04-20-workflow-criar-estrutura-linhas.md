# Workflow: Criar script de mapeamento estrutural e atualizar guia arquitetural

```mermaid
flowchart TD
    A[Inicio] --> B[Criar script Node para gerar estrutura de linhas]
    B --> C[Atualizar ESTRUTURA.md com arquitetura Taça das Casas]
    C --> D[Executar script e gerar ESTRUTURA-LINHAS.md]
    D --> E[Salvar log de desenvolvimento e Fim]
```

- [⏳] Configurar `scripts/gerar-estrutura-arquivos-linhas.js`
- [⏳] Refletir nova realidade no `ESTRUTURA.md` (`frontend`, `backend`, `database`)
- [⏳] Rodar o script e gravar `ESTRUTURA-LINHAS.md`
- [⏳] Atualizar `changelog`.
