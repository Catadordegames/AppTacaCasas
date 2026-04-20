const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.claude',
  '.roo',
  '.gemini',
]);

const EXCLUDED_FILES = new Set([
  'package-lock.json',
]);

const DESCRIPTIONS = {
  'docker-compose.yml': 'Orquestração local com React, API e MariaDB',
  'README.md': 'Documentação principal do projeto',
  'backend': 'Servidor backend API (Node + Express)',
  'backend/src': 'Lógica de backend Node',
  'backend/src/controllers': 'Controladores HTTP',
  'backend/src/repositories': 'Acesso a dados MariaDB',
  'backend/src/routes': 'Definição de Rotas API',
  'backend/src/services': 'Regras de Negócio',
  'backend/src/middlewares': 'Filtros e middlewares Express',
  'backend/src/config': 'Configurações de banco, app',
  'backend/src/app.js': 'Instância principal do Express',
  'backend/src/config/database.js': 'Inicialização e conexão ao MariaDB',
  'frontend': 'Interface da aplicação (React + Vite)',
  'frontend/public': 'Assets públicos acessíveis externamente',
  'frontend/src': 'Lógica de negócio Frontend escrita em React',
  'frontend/src/components': 'Componentes reaproveitáveis de UI e layout',
  'frontend/src/context': 'Hooks de contexto global (AuthContext e etc)',
  'frontend/src/hooks': 'Controladores estritos das Views (Custom Hooks)',
  'frontend/src/services': 'Libs internas (Manipuladores de Requisição Axios)',
  'frontend/src/utils': 'Extratores, formatadores e classes dinâmicas',
  'frontend/src/views': 'Templates visuais principais da interface (Páginas)',
  'frontend/src/views/admin': 'Páginas estritas ao perfil da Coordenação',
  'frontend/src/views/professor': 'Páginas estritas ao perfil do Professor logado',
  'frontend/src/views/public': 'Placar das casas global / Dashboard',
  'docs': 'Documentação técnica e de gestão',
  'docs/changelog': 'Registros de alterações diárias (MD)',
  'docs/workflow': 'Logs de execução de tarefas dos devs',
  'docs/ESTRUTURA-LINHAS.md': 'Contagem computada de arquivos e linhas (Gerado)',
  'docs/ESTRUTURA.md': 'Este arquivo de mapa base do projeto',
  'docs/REGRAS.md': 'Regras de desenvolvimento e padronização',
  'sql': 'Scripts e manipulações de banco de dados',
  'sql/init.sql': 'Estruturas e seeds do MariaDB',
  'scripts': 'Scripts de automação e utilitários',
  'scripts/gerar-estrutura-arquivos-linhas.js': 'Analisa árvore e atualiza ESTRUTURA-LINHAS.md'
};

function getIcon(filename, isDir) {
  if (isDir) return '📁';
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) return '📜';
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return '📜';
  if (filename.endsWith('.md')) return '📝';
  if (filename.endsWith('.json') || filename.endsWith('.yml') || filename.endsWith('.yaml')) return '⚙️';
  if (filename.endsWith('.css')) return '🎨';
  if (filename.endsWith('.html') || filename.endsWith('.sql') || filename.endsWith('.env')) return '📄';
  return '📄';
}

function scanDir(dirPath, rootPath) {
  let stats = { totalLines: 0, children: [] };
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name) || EXCLUDED_FILES.has(entry.name)) continue;
    
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(rootPath, fullPath).replace(/\\/g, '/');
    
    if (entry.name === 'ESTRUTURA-LINHAS.md') continue;
    
    if (entry.isDirectory()) {
      const childStats = scanDir(fullPath, rootPath);
      stats.totalLines += childStats.totalLines;
      stats.children.push({
        name: entry.name,
        relPath: relPath,
        isDir: true,
        lines: childStats.totalLines,
        children: childStats.children
      });
    } else {
      let lines = 0;
      try {
        const stat = fs.statSync(fullPath);
        if (stat.size > 2 * 1024 * 1024) continue;
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.indexOf('\0') !== -1) continue;
        lines = content.split('\n').length;
      } catch (e) {
        continue;
      }
      stats.totalLines += lines;
      stats.children.push({
        name: entry.name,
        relPath: relPath,
        isDir: false,
        lines: lines,
        children: []
      });
    }
  }
  
  stats.children.sort((a, b) => {
    if (a.isDir && !b.isDir) return -1;
    if (!a.isDir && b.isDir) return 1;
    return a.name.localeCompare(b.name);
  });
  
  return stats;
}

function padString(str, length) {
  if (str.length >= length) return str + ' ';
  return str + ' '.repeat(length - str.length);
}

function generateTreeText(node, prefix = '') {
  let output = '';
  
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const isLast = (i === node.children.length - 1);
    const connector = isLast ? '└── ' : '├── ';
    const icon = getIcon(child.name, child.isDir);
    
    let desc = DESCRIPTIONS[child.relPath];
    if (!desc) {
      if (child.isDir) desc = 'Diretório';
      else {
        // Find domain for backend explicitly
        if (child.relPath.startsWith('backend/') && !child.name.includes('.')) {
          desc = 'Domínio de ' + child.name;
        } else {
          desc = 'Arquivo ' + path.extname(child.name).toUpperCase().replace('.', '');
        }
      }
    }
    
    const lineInfo = child.lines > 0 ? `(${child.lines} linhas)` : '';
    const namePart = `${prefix}${connector}${icon} ${child.name + (child.isDir ? '/' : '')}`;
    
    // Alinha na coluna 64
    const paddedNamePart = padString(namePart, 64);
    
    output += `${paddedNamePart}# → ${desc} ${lineInfo}\n`;
    
    if (child.isDir) {
      output += generateTreeText(child, prefix + (isLast ? '    ' : '│   '));
    }
  }
  return output;
}

const rootPath = path.join(__dirname, '..');
const tree = scanDir(rootPath, rootPath);
const now = new Date();

const outputText = `# Estrutura de Arquivos - Linhas

> Gerado em: ${now.toISOString()}
> Comando: node scripts/gerar-estrutura-arquivos-linhas.js

\`\`\`text
📁 taca-das-casas/                                              # → Diretório raiz do projeto (${tree.totalLines} linhas)
${generateTreeText(tree)}\`\`\`
`;

fs.writeFileSync(path.join(rootPath, 'docs', 'ESTRUTURA-LINHAS.md'), outputText);
console.log('docs/ESTRUTURA-LINHAS.md atualizado com as descrições e contagens!');
