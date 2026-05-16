/**
 * Skeleton genérico de tabla — se usa mientras loading === true
 */
export function TableSkeleton({ cols = 5, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-slate-100">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className="h-4 bg-slate-200 rounded animate-pulse"
                style={{ width: `${60 + ((i * cols + j) * 7) % 35}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/**
 * Mensaje de error amigable para la API
 */
export function ApiError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">⚠️</div>
      <p className="text-slate-600 font-medium">No se pudo conectar al servidor</p>
      <p className="text-sm text-slate-400 max-w-xs text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-500 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
