import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="card empty">
      <h1>Страница не найдена</h1>
      <Link className="button button-primary" to="/">К списку задач</Link>
    </section>
  );
}
