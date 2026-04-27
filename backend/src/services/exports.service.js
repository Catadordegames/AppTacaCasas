const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

// Diretório de exports
const EXPORT_DIR = path.join(__dirname, '../../storage/exports');

// Garante que o diretório exista ao carregar o serviço
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

/**
 * Gera o CSV, salva em disco e valida a integridade do arquivo.
 * @param {Array} dados Array de objetos contendo os dados a serem exportados.
 * @param {string} nomeArquivo O nome do arquivo a ser salvo (ex: 'lancamentos_2023.csv').
 * @returns {Promise<{ success: boolean, filePath: string, csvString: string }>} Objeto de resultado.
 */
async function gerarSalvarEValidarCSV(dados, nomeArquivo) {
  try {
    if (!dados || dados.length === 0) {
      console.warn('Tentativa de exportar CSV com dados vazios.');
      return { success: false, filePath: null, csvString: null };
    }

    // 1. Gera a string CSV
    // A biblioteca json2csv lidará perfeitamente com aspas e vírgulas nos valores
    const csvString = parse(dados, { withBOM: true }); // withBOM ajuda o Excel a reconhecer UTF-8

    // 2. Define o caminho do arquivo
    const filePath = path.join(EXPORT_DIR, nomeArquivo);

    // 3. Salva no disco (A esteira de salvamento obrigatório)
    await fs.promises.writeFile(filePath, csvString, 'utf8');

    // 4. Validação Física
    const stats = await fs.promises.stat(filePath);

    if (stats.size > 0) {
      // Sucesso: Arquivo criado e não está vazio
      return { success: true, filePath, csvString };
    } else {
      // Falha: Arquivo ficou vazio por algum motivo
      // Apaga o arquivo defeituoso
      await fs.promises.unlink(filePath).catch(() => {});
      console.error(`Validação falhou: Arquivo ${nomeArquivo} está vazio.`);
      return { success: false, filePath: null, csvString: null };
    }
  } catch (error) {
    console.error('Erro no serviço de exportação CSV:', error);
    return { success: false, filePath: null, csvString: null };
  }
}

module.exports = {
  gerarSalvarEValidarCSV,
};
