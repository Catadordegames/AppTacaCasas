// ============================================================
// controllers/perfil.controller.js
// Lida com o perfil do usuário logado e troca de senha.
// ============================================================

const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const PerfilController = {
  async getMe(req, res, next) {
    try {
      const id = req.usuario.id;
      const [rows] = await pool.query('SELECT id, nome, permissao, casa_id, email, telefone, senha_alterada FROM professores WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(rows[0]);
    } catch (error) {
      next(error);
    }
  },

  async updateMe(req, res, next) {
    try {
      const id = req.usuario.id;
      const { email, telefone } = req.body;
      await pool.query('UPDATE professores SET email = ?, telefone = ? WHERE id = ?', [email || null, telefone || null, id]);
      res.json({ message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      next(error);
    }
  },

  async updateSenha(req, res, next) {
    try {
      const id = req.usuario.id;
      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
      }

      // Validar força da senha no backend
      if (novaSenha.length < 6 || novaSenha.length > 20) {
        return res.status(400).json({ error: 'A nova senha deve ter entre 6 e 20 caracteres.' });
      }
      if (!/[A-Z]/.test(novaSenha)) {
        return res.status(400).json({ error: 'A nova senha deve conter pelo menos uma letra maiúscula.' });
      }
      if (!/[0-9]/.test(novaSenha)) {
        return res.status(400).json({ error: 'A nova senha deve conter pelo menos um número.' });
      }

      const [rows] = await pool.query('SELECT senha FROM professores WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

      const senhaCorreta = await bcrypt.compare(senhaAtual, rows[0].senha);
      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Senha atual incorreta.' });
      }

      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
      await pool.query('UPDATE professores SET senha = ?, senha_alterada = TRUE WHERE id = ?', [novaSenhaHash, id]);

      res.json({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = PerfilController;
