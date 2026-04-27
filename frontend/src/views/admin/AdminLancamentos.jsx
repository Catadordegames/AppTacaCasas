// ============================================================
// pages/admin/AdminLancamentos.jsx
// View: Interface do admin de Lançamentos.
// ============================================================

import { Trash2, Download, AlertTriangle, ClipboardList, RefreshCw } from 'lucide-react'
import useAdminLancamentos from '../../hooks/useAdminLancamentos'

function formatDate(dt) {
  return new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function AdminLancamentos() {
  const {
    lancamentos, casas, turmas, loading, deletando, resetando,
    confirmarReset, setConfirmarReset, filtros, setFiltro,
    deletar, exportarCSV, exportarRanking, resetAnual, total
  } = useAdminLancamentos()

  return (
    <div className="space-y-5">
      <div className="card px-4 py-3 border border-background-600 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <ClipboardList size={22} className="text-primary-400" />
          <h1 className="text-2xl font-display font-bold text-white">Todos os Lançamentos</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={exportarRanking} className="btn-secondary flex items-center gap-1.5 text-sm py-1.5">
            <Download size={14} /> Ranking CSV
          </button>
          <button onClick={exportarCSV} className="btn-secondary flex items-center gap-1.5 text-sm py-1.5">
            <Download size={14} /> Exportar CSV
          </button>
          <button onClick={() => setConfirmarReset(true)} className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-400 hover:bg-red-900/50 transition-colors font-semibold">
            <RefreshCw size={14} /> Reset Anual
          </button>
        </div>
      </div>

      <div className="card border border-background-600 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="label text-xs">Casa</label>
          <select className="input text-sm py-1.5" value={filtros.casa_id} onChange={(e) => setFiltro('casa_id', e.target.value)}>
            <option value="">Todas</option>
            {casas.map((c) => <option key={c.id} value={c.id}>{c.brasao} {c.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="label text-xs">Turma</label>
          <select className="input text-sm py-1.5" value={filtros.turma_id} onChange={(e) => setFiltro('turma_id', e.target.value)}>
            <option value="">Todas</option>
            {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="label text-xs">De</label>
          <input type="date" className="input text-sm py-1.5" value={filtros.data_inicio} onChange={(e) => setFiltro('data_inicio', e.target.value)} />
        </div>
        <div>
          <label className="label text-xs">Até</label>
          <input type="date" className="input text-sm py-1.5" value={filtros.data_fim} onChange={(e) => setFiltro('data_fim', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card border border-background-500 text-center">
          <div className="text-2xl font-display font-bold text-primary-400">{lancamentos.length}</div>
          <div className="text-xs text-gray-500 mt-0.5">Lançamentos</div>
        </div>
        <div className={`card border text-center ${total >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
          <div className={`text-2xl font-display font-bold ${total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {total > 0 ? '+' : ''}{total}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Pontos no filtro</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : lancamentos.length === 0 ? (
        <div className="card text-center py-12 text-gray-500 border border-background-600"><ClipboardList size={36} className="mx-auto mb-3 opacity-30" /><p>Nenhum lançamento encontrado.</p></div>
      ) : (
        <div className="space-y-2">
          {lancamentos.map((l) => (
            <div key={l.id} className="card border border-background-600 flex items-start gap-3">
              <div className={`flex-shrink-0 w-14 text-center font-display font-bold text-lg rounded-lg py-1 ${l.pontuacao > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {l.pontuacao > 0 ? '+' : ''}{l.pontuacao}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{l.justificativa_snapshot}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500">
                  <span>🏠 {l.casa_nome}</span>{l.turma_nome && <span>📚 {l.turma_nome}</span>}{l.aluno_nome && <span>👤 {l.aluno_nome}</span>}
                  <span className="text-gray-600">por {l.professor_nome}</span><span>🕐 {formatDate(l.data_lancamento)}</span>
                </div>
              </div>
              <button onClick={() => deletar(l.id)} disabled={deletando === l.id} className="flex-shrink-0 text-gray-600 hover:text-red-400 transition-colors p-1 disabled:opacity-40">
                {deletando === l.id ? <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={16} />}
              </button>
            </div>
          ))}
        </div>
      )}

      {confirmarReset && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background-800 border border-red-700/50 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400"><AlertTriangle size={24} /><h3 className="font-display font-bold text-lg">Reset Anual</h3></div>
            <p className="text-gray-300 text-sm">Esta ação irá <strong className="text-red-400">deletar permanentemente todos os lançamentos</strong>. Backup ocorrerá automaticamente.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmarReset(false)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={resetAnual} disabled={resetando} className="flex-1 btn-danger">{resetando ? 'Resetando...' : '⚠️ Confirmar Reset'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}