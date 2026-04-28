import api from '../services/api';

/**
 * Utilitário genérico para fazer download de arquivos gerados pelo backend (como CSVs).
 * 
 * @param {string} endpoint - Rota da API (ex: '/exports/alunos')
 * @param {string} defaultFilename - Nome padrão do arquivo (será usado se o backend não enviar no Content-Disposition)
 * @param {object} options - Opções adicionais (method, body)
 */
export const downloadBlobFromApi = async (endpoint, defaultFilename = 'export.csv', options = {}) => {
  try {
    const { method = 'GET', body = null } = options;
    
    // Fazer a requisição informando que a resposta esperada é um blob (arquivo)
    const config = { responseType: 'blob' };
    
    let response;
    if (method.toUpperCase() === 'POST') {
      response = await api.post(endpoint, body, config);
    } else {
      response = await api.get(endpoint, config);
    }

    // Tentar extrair o nome do arquivo do cabeçalho de resposta (Content-Disposition)
    let filename = defaultFilename;
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) { 
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Criar uma URL temporária para o Blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Criar um elemento <a> virtual para forçar o download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    
    // Anexar, clicar e remover
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    // Liberar a memória da URL criada
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Erro ao baixar o arquivo:', error);
    throw error; // Lançar o erro para que o componente chamador possa tratar (ex: mostrar um toast de erro)
  }
};
