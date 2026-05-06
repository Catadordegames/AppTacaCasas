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
      const [rows] = await pool.query('SELECT id, nome, cpf, permissao, casa_id, email, telefone, senha_alterada FROM professores WHERE id = ?', [id]);
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
      // Limpar dígitos do telefone antes de salvar
      const telLimpo = telefone ? telefone.replace(/\D/g, '') : null;
      await pool.query('UPDATE professores SET email = ?, telefone = ? WHERE id = ?', [email || null, telLimpo, id]);
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
  },

  /**
   * Cadastra o CPF do professor logado.
   * Só permite se o CPF atual for NULL (primeiro cadastro).
   */
  async updateCPF(req, res, next) {
    try {
      const id = req.usuario.id;
      const { cpf } = req.body;

      if (!cpf) {
        return res.status(400).json({ error: 'CPF é obrigatório.' });
      }

      // Limpar dígitos
      const cpfLimpo = cpf.replace(/\D/g, '');

      if (cpfLimpo.length !== 11) {
        return res.status(400).json({ error: 'CPF deve conter 11 dígitos.' });
      }

      // Validar dígitos verificadores (módulo 11)
      if (/^(\d)\1{10}$/.test(cpfLimpo)) {
        return res.status(400).json({ error: 'CPF inválido.' });
      }

      let soma = 0;
      for (let i = 0; i < 9; i++) soma += Number(cpfLimpo[i]) * (10 - i);
      let resto = soma % 11;
      const d1 = resto < 2 ? 0 : 11 - resto;
      if (Number(cpfLimpo[9]) !== d1) {
        return res.status(400).json({ error: 'CPF inválido.' });
      }

      soma = 0;
      for (let i = 0; i < 10; i++) soma += Number(cpfLimpo[i]) * (11 - i);
      resto = soma % 11;
      const d2 = resto < 2 ? 0 : 11 - resto;
      if (Number(cpfLimpo[10]) !== d2) {
        return res.status(400).json({ error: 'CPF inválido.' });
      }

      // Verificar se o professor atual já tem CPF cadastrado
      const [atual] = await pool.query('SELECT cpf FROM professores WHERE id = ?', [id]);
      if (atual.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
      if (atual[0].cpf) {
        return res.status(400).json({ error: 'CPF já cadastrado. Não é possível alterar.' });
      }

      // Verificar unicidade do CPF
      const [existente] = await pool.query('SELECT id FROM professores WHERE cpf = ? AND id != ?', [cpfLimpo, id]);
      if (existente.length > 0) {
        return res.status(409).json({ error: 'Este CPF já está vinculado a outro professor.' });
      }

      await pool.query('UPDATE professores SET cpf = ? WHERE id = ?', [cpfLimpo, id]);

      res.json({ message: 'CPF cadastrado com sucesso!', cpf: cpfLimpo });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = PerfilController;
