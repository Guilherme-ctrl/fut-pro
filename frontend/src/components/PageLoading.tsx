/** Skeleton genérico para listas e cards durante fetch. */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div style={{ marginTop: '0.5rem' }} aria-busy="true" aria-label="Carregando">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: 76, marginBottom: '0.65rem', borderRadius: 12 }}
        />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando dashboard">
      <div className="grid-stats" style={{ marginTop: '0.75rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat" style={{ padding: '1rem' }}>
            <div
              className="skeleton"
              style={{ height: 28, width: '40%', marginBottom: 8 }}
            />
            <div className="skeleton" style={{ height: 14, width: '70%' }} />
          </div>
        ))}
      </div>
      <div
        className="skeleton"
        style={{ height: 100, marginTop: '1rem', borderRadius: 12 }}
      />
    </div>
  );
}

export function ErrorRetry({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="card error-card">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
