export function ErrorBanner({ error }) {
  if (!error) return null;
  return (
    <div className="banner banner-error" role="alert">
      {error.message || 'Не удалось выполнить запрос'}
    </div>
  );
}

export function NoticeBanner({ message }) {
  if (!message) return null;
  return (
    <div className="banner banner-success" role="status">
      {message}
    </div>
  );
}
