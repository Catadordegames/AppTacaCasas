// ============================================================
// services/lancamentos.service.js
// Regras de negócio mais complexas do sistema:
// - Monta o snapshot histórico completo no momento do lançamento
// - Professor só pode deletar seus próprios lançamentos (por nome)
// - Admin pode deletar qualquer lançamento
// Estrutura v3: sem FKs, somente snapshots de texto.
// ============================================================

const LancamentosRepository = require('../repositories/lancamentos.repository');
const CasasRepository = require('../repositories/casas.repository');
const AlunosRepository = require('../repositories/alunos.repository');
const TurmasRepository = require('../repositories/turmas.repository');
const JustificativasRepository = require('../repositories/justificativas.repository');

const LancamentosService = {
  /**
   * Lista lançamentos.
   * Todos os usuários autenticados veem todos os lançamentos.
   * Filtros por professor, casa, data etc. continuam disponíveis via query params.
   */
  async listar(usuario, filtros = {}) {
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
      is_custom, turno, complemento,
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
    let justificativa;

    if (is_custom) {
      // Justificativa personalizada: pontuação vem no body
      if (body.pontuacao === undefined) {
        const e = new Error('Pontuação é obrigatória para justificativa personalizada.');
        e.status = 400; throw e;
      }
      pontuacao = Number(body.pontuacao);
      justificativa = custom_justificativa;
    } else {
      // Justificativa padrão: busca pontos da tabela
      const just = await JustificativasRepository.buscarPorId(justificativa_id);
      if (!just) {
        const e = new Error('Justificativa não encontrada.'); e.status = 404; throw e;
      }
      pontuacao = just.pontos;
      justificativa = just.nome; // SNAPSHOT do nome atual
    }

    // Snapshot do aluno (opcional)
    let aluno = null;
    let turma_id_final = turma_id || null;
    let turma = null;

    if (aluno_id) {
      const alunoObj = await AlunosRepository.buscarPorId(aluno_id);
      if (alunoObj) {
        aluno = alunoObj.nome;
        if (!turma_id_final) turma_id_final = alunoObj.turma_id;
      }
    }

    if (turma_id_final) {
      const turmaObj = await TurmasRepository.buscarPorId(turma_id_final);
      if (turmaObj) turma = turmaObj.nome;
    }

    const dados = {
      professor: usuario.nome,
      casa: casa.nome,
      aluno,
      turma,
      justificativa,
      complemento: complemento || null,
      is_custom: Boolean(is_custom),
      turno: turno || null,
      pontuacao,
      data_lancamento: new Date(),
    };

    const id = await LancamentosRepository.criar(dados);
    return LancamentosRepository.buscarPorId(id);
  },

  /**
   * Atualiza um lançamento (pontuação e justificativa).
   * Regra: professor só pode editar os seus (por nome). Admin pode tudo.
   */
  async atualizar(id, usuario, body) {
    const lancamento = await this.buscarPorId(id);

    if (usuario.permissao !== 1 && lancamento.professor !== usuario.nome) {
      const e = new Error('Você não tem permissão para editar este lançamento.');
      e.status = 403; throw e;
    }

    const { pontuacao, justificativa } = body;
    if (pontuacao === undefined && !justificativa) {
      const e = new Error('Informe ao menos pontuação ou justificativa para atualizar.');
      e.status = 400; throw e;
    }

    await LancamentosRepository.atualizar(id, {
      pontuacao: pontuacao !== undefined ? Number(pontuacao) : lancamento.pontuacao,
      justificativa: justificativa || lancamento.justificativa,
    });
    return LancamentosRepository.buscarPorId(id);
  },

  /**
   * Deleta um lançamento.
   * Regra: professor só pode deletar os seus (por nome). Admin pode tudo.
   */
  async deletar(id, usuario) {
    const lancamento = await this.buscarPorId(id);

    if (usuario.permissao !== 1 && lancamento.professor !== usuario.nome) {
      const e = new Error('Você não tem permissão para remover este lançamento.');
      e.status = 403; throw e;
    }

    await LancamentosRepository.deletar(id);
  },
};

module.exports = LancamentosService;