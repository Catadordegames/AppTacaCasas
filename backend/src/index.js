require('dotenv').config();
const app = require('./app');
const { runMigrations } = require('./config/runMigrations');

const PORT = process.env.PORT || 3001;

// Executa migrations antes de levantar o servidor.
// Isso garante que o schema esteja sempre atualizado
// em todo deploy (incluindo o primeiro).
runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🏆 Taça das Casas API rodando na porta ${PORT}`);
      console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('❌ Falha ao aplicar migrations:', err.message);
    process.exit(1);
  });
