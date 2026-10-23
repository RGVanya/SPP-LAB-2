import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="logo" to="/">
            <span className="logo-mark">✓</span>
            Менеджер задач
          </Link>
          <Link className="button button-primary" to="/tasks/new">
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
            Новая задача
          </Link>
        </div>
      </header>
      <main className="container page">
        <Outlet />
      </main>
    </>
  );
}
