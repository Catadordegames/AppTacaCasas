// ============================================================
// middlewares/auth.middleware.js
// Verifica se o token JWT é válido e injeta os dados do
// professor autenticado em req.usuario para uso nos controllers.
// ============================================================

const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação.
 * Lê o header "Authorization: Bearer <token>", valida e decodifica.
 */
const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Injeta dados do professor autenticado na requisição
    req.usuario = {
      id: payload.id,
      nome: payload.nome,
      permissao: payload.permissao,
      casa_id: payload.casa_id,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

/**
 * Middleware de autorização para admins (permissao = 1).
 * SEMPRE use após autenticar().
 */
const apenasAdmin = (req, res, next) => {
  if (req.usuario.permissao !== 1) {
    return res.status(403).json({ error: 'Acesso restrito à gestão da escola/diretoria.' });
  }
  next();
};

module.exports = { autenticar, apenasAdmin };