// ============================================================
// services/lancamentos.service.js
// Regras de negócio mais complexas do sistema:
// - Monta o snapshot histórico completo no momento do lançamento
// - Professor só pode deletar seus próprios lançamentos
// - Admin pode deletar qualquer lançamento
// ============================================================

const LancamentosRepository = require('../repositories/lancamentos.repository');
const CasasRepository = require('../repositories/casas.repository');
const AlunosRepository = require('../repositories/alunos.repository');
const TurmasRepository = require('../repositories/turmas.repository');
const JustificativasRepository = require('../repositories/justificativas.repository');

const LancamentosService = {
  /**
   * Lista lançamentos.
   * Professor (permissao=1) vê apenas os seus.
   * Admin (permissao=2) vê todos.
   */
  async listar(usuario, filtros = {}) {
    if (usuario.permissao === 1) {
      filtros.professor_id = usuario.id;
    }
    return LancamentosRepository.listar(filtros);
  },

  async buscarPorId(id) {
    const lancamento = await LancamentosRepository.buscarPorId(id);
    if (!lancamento) {
      const e = new Error('Lançamento não encontrado.'); e.status = 404; throw e;
    }
    return lancamento;
  },

  /**
   * Cria um lançamento salvando SNAPSHOT completo dos dados.
   * Isso garante que mesmo se um aluno/casa/justificativa for
   * renomeado no futuro, o histórico permanece correto.
   */
  async criar(usuario, body) {
    const {
      casa_id, aluno_id, turma_id,
      justificativa_id, custom_justificativa,
      is_custom, turno,
    } = body;

    // ── Validações básicas ──────────────────────────────────
    if (!casa_id) {
      const e = new Error('Casa é obrigatória.'); e.status = 400; throw e;
    }
    if (is_custom && !custom_justificativa) {
      const e = new Error('Justificativa personalizada é obrigatória quando is_custom=true.');
      e.status = 400; throw e;
    }
    if (!is_custom && !justificativa_id) {
      const e = new Error('Justificativa é obrigatória.'); e.status = 400; throw e;
    }

    // ── Busca dados para snapshot ──────────────────────────
    const casa = await CasasRepository.buscarPorId(casa_id);
    if (!casa) {
      const e = new Error('Casa não encontrada.'); e.status = 404; throw e;
    }

    let pontuacao;
    let justificativa_snapshot;

    if (is_custom) {
      // Justificativa personalizada: pontuação vem no body
      if (body.pontuacao === undefined) {
        const e = new Error('Pontuação é obrigatória para justificativa personalizada.');
        e.status = 400; throw e;
      }
      pontuacao = Number(body.pontuacao);
      justificativa_snapshot = custom_justificativa;
    } else {
      // Justificativa padrão: busca pontos da tabela
      const justificativa = await JustificativasRepository.buscarPorId(justificativa_id);
      if (!justificativa) {
        const e = new Error('Justificativa não encontrada.'); e.status = 404; throw e;
      }
      pontuacao = justificativa.pontos;
      justificativa_snapshot = justificativa.nome; // SNAPSHOT do nome atual
    }

    // Snapshot do aluno (opcional)
    let aluno_nome = null;
    let turma_id_final = turma_id || null;
    let turma_nome = null;

    if (aluno_id) {
      const aluno = await AlunosRepository.buscarPorId(aluno_id);
      if (aluno) {
        aluno_nome = aluno.nome;
        if (!turma_id_final) turma_id_final = aluno.turma_id;
      }
    }

    if (turma_id_final) {
      const turma = await TurmasRepository.buscarPorId(turma_id_final);
      if (turma) turma_nome = turma.nome;
    }

    const dados = {
      professor_id: usuario.id,
      professor_nome: usuario.nome,
      casa_id,
      casa_nome: casa.nome,
      aluno_id: aluno_id || null,
      aluno_nome,
      turma_id: turma_id_final,
      turma_nome,
      justificativa_id: is_custom ? null : justificativa_id,
      custom_justificativa: is_custom ? custom_justificativa : null,
      justificativa_snapshot,
      is_custom: Boolean(is_custom),
      turno: turno || null,
      pontuacao,
      data_lancamento: new Date(),
    };

    const id = await LancamentosRepository.criar(dados);
    return LancamentosRepository.buscarPorId(id);
  },

  /**
   * Deleta um lançamento.
   * Regra: professor só pode deletar os seus. Admin pode tudo.
   */
  async deletar(id, usuario) {
    const lancamento = await this.buscarPorId(id);

    if (usuario.permissao !== 2 && lancamento.professor_id !== usuario.id) {
      const e = new Error('Você não tem permissão para remover este lançamento.');
      e.status = 403; throw e;
    }

    await LancamentosRepository.deletar(id);
  },
};

module.exports = LancamentosService;