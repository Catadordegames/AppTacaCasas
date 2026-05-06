// ============================================================
// pages/admin/AdminCasas.jsx
// CRUD de Casas (Equipes). v3: Sem edição, somente criação e exclusão.
// ============================================================

import { Plus, Shield } from 'lucide-react'
import CrudTable from '../../components/ui/CrudTable'
import Modal from '../../components/ui/Modal'
import useAdminCasas from '../../hooks/useAdminCasas'

export default function AdminCasas() {
  const { casas, loading, salvando, deletando, modalAberto, form, setForm, abrirCriar, fecharModal, handleSalvar, handleDeletar } = useAdminCasas()

  const columns = [
    { 
      key: 'brasao', 
      label: 'Brasão', 
      render: (v) => v?.startsWith('/api/uploads') ? (
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group cursor-default">
          <div className="absolute inset-0 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img 
            src={v} 
            alt="Brasão" 
            className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
          />
        </div>
      ) : (
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group cursor-default">
          <span className="text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110 drop-shadow-md">
            {v}
          </span>
        </div>
      )
    },
    { key: 'nome',   label: 'Nome'   },
  ]

  return (
    <div className="space-y-5">
      <div className="card px-4 py-3 border border-background-600 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Shield size={22} className="text-primary-400" />
          <h1 className="text-2xl font-display font-bold text-white">Casas</h1>
        </div>
        <button onClick={abrirCriar} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Nova Casa
        </button>
      </div>

      <div className="card border border-background-600">
        <CrudTable
          columns={columns}
          data={casas}
          loading={loading}
          onDelete={handleDeletar}
          deletando={deletando}
          searchPlaceholder="Buscar casa..."
        />
      </div>

      {modalAberto && (
        <Modal title="Nova Casa" onClose={fecharModal}>
          <form onSubmit={handleSalvar} className="space-y-4">
            <div>
              <label className="label">Nome *</label>
              <input className="input" placeholder="Ex: Casa Leão" value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div>
              <label className="label">Brasão (Imagem .png)</label>
              <input type="file" className="input p-2" accept=".png, image/png"
                onChange={(e) => setForm({ ...form, arquivoBrasao: e.target.files[0] })} />
            </div>
            <div>
              <label className="label">Ou Brasão Alternativo (emoji)</label>
              <input 
                className="input" 
                placeholder="Ex: 🦁" 
                value={form.brasao}
                onChange={(e) => setForm({ ...form, brasao: e.target.value })} 
              />
              
              {/* Preview Inteligente */}
              {form.brasao && !form.arquivoBrasao && (
                <div className="flex justify-center mt-4 bg-background-700/50 p-4 rounded-xl border border-background-600">
                  <div className="text-center text-5xl drop-shadow-md">{form.brasao}</div>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={fecharModal} className="btn-secondary flex-1">Cancelar</button>
              <button type="submit" disabled={salvando} className="btn-primary flex-1">
                {salvando ? 'Salvando...' : 'Criar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}