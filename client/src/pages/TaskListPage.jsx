import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useApi } from '../api/context';
import { ErrorBanner, NoticeBanner } from '../components/Banners';
import { StatusBadge } from '../components/StatusBadge';
import { STATUS_OPTIONS } from '../constants';
import { formatDate } from '../format';

export function TaskListPage() {
  const api = useApi();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const status = params.get('status') || '';
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(location.state?.message || '');
  const [pendingId, setPendingId] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.list(status)
      .then((data) => {
        if (active) setTasks(data.tasks);
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, status]);

  function onStatusChange(event) {
    const value = event.target.value;
    setParams(value ? { status: value } : {});
  }

  async function onDelete(task) {
    if (!window.confirm(`Удалить задачу «${task.title}»?`)) return;
    setPendingId(task.id);
    setError(null);
    try {
      await api.remove(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      setNotice(`Задача «${task.title}» удалена`);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setPendingId('');
    }
  }

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Задачи</h1>
          <p className="muted">Список обновляется без перезагрузки страницы.</p>
        </div>
        <label className="field filter-field">
          <span>Статус</span>
          <select value={status} onChange={onStatusChange}>
            <option value="">Все</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <NoticeBanner message={notice} />
      <ErrorBanner error={error} />

      {loading && <p className="muted">Загрузка…</p>}

      {!loading && tasks.length === 0 && (
        <div className="card empty">
          <p>Задач пока нет.</p>
          <Link className="button button-primary" to="/tasks/new">Создать первую</Link>
        </div>
      )}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="card task-card">
            <div className="task-card-main">
              <div className="task-card-title">
                <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                <StatusBadge status={task.status} />
              </div>
              {task.description && <p className="muted task-description">{task.description}</p>}
              <p className="meta">Срок: {formatDate(task.dueDate)}</p>
            </div>
            <button
              className="button button-danger"
              type="button"
              disabled={pendingId === task.id}
              onClick={() => onDelete(task)}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
