// ============================================================
// components/ui/CrudTable.jsx
// Componente genérico de tabela com busca e botões de ação.
// Reduz drasticamente a duplicação nas 6 páginas admin.
// Uso:
//   <CrudTable
//     columns={[{ key: 'nome', label: 'Nome' }, ...]}
//     data={rows}
//     onEdit={handleEdit}
//     onDelete={handleDelete}
//     loading={loading}
//   />
// ============================================================

import { useState } from 'react'
import { Pencil, Trash2, Search } from 'lucide-react'

export default function CrudTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  loading = false,
  searchPlaceholder = 'Buscar...',
  searchKey = 'nome',
  deletando = null,
}) {
  const [busca, setBusca] = useState('')

  const filtrado = busca.trim()
    ? data.filter((row) =>
        String(row[searchKey] ?? '').toLowerCase().includes(busca.toLowerCase())
      )
    : data

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Busca */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          className="input pl-8 text-sm"
          placeholder={searchPlaceholder}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Tabela — scroll horizontal no mobile */}
      <div className="overflow-x-auto rounded-xl border border-dark-600">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-dark-700 text-left">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-600">
            {filtrado.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center text-gray-500 py-10">
                  {busca ? 'Nenhum resultado para a busca.' : 'Nenhum registro cadastrado.'}
                </td>
              </tr>
            ) : (
              filtrado.map((row) => (
                <tr key={row.id} className="bg-dark-800 hover:bg-dark-700 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-300">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="text-gray-500 hover:text-gold-400 transition-colors p-1"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            disabled={deletando === row.id}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1 disabled:opacity-40"
                            title="Deletar"
                          >
                            {deletando === row.id
                              ? <div className="w-4 h-4 border border-red-400 border-t-transparent rounded-full animate-spin" />
                              : <Trash2 size={15} />
                            }
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-600 text-right">
        {filtrado.length} de {data.length} registro{data.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}