import { useEffect, useState } from 'react';

export function ErrorBanner({ error }) {
  if (!error) return null;
  return (
    <div className="banner banner-error" role="alert">
      <span className="banner-icon">⚠</span>
      <span>{error.message || 'Не удалось выполнить запрос'}</span>
    </div>
  );
}

export function NoticeBanner({ message }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4500);
    return () => clearTimeout(timer);
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className="banner banner-success banner-toast" role="status">
      <span className="banner-icon">✓</span>
      <span>{message}</span>
      <button className="banner-close" type="button" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
}
