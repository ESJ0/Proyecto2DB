import './Table.css'

export default function Table({ columns, data, onEdit, onDelete, emptyMessage = 'Sin registros' }) {
  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <span>{emptyMessage}</span>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th className="table-actions-th">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="table-actions">
                  {onEdit && (
                    <button className="table-btn table-btn--edit" onClick={() => onEdit(row)}>
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button className="table-btn table-btn--delete" onClick={() => onDelete(row)}>
                      Eliminar
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}