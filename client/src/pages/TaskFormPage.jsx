import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../api/context';
import { ErrorBanner } from '../components/Banners';
import { TaskForm } from '../components/TaskForm';

const EMPTY_TASK = {
  title: '',
  description: '',
  status: 'new',
  dueDate: '',
};

export function TaskFormPage() {
  const api = useApi();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return undefined;
    let active = true;
    api.get(id)
      .then((data) => {
        if (active) setInitial(data.task);
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
  }, [api, id, isEdit]);

  async function onSubmit(form) {
    setPending(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        dueDate: form.dueDate,
      };
      const data = isEdit ? await api.update(id, payload) : await api.create(payload);
      navigate(`/tasks/${data.task.id}`, {
        state: { message: isEdit ? 'Задача обновлена' : 'Задача создана' },
      });
    } catch (requestError) {
      setError(requestError);
      setPending(false);
    }
  }

  return (
    <section>
      <Link className="back-link" to={isEdit ? `/tasks/${id}` : '/'}>Назад</Link>
      <h1>{isEdit ? 'Редактирование' : 'Новая задача'}</h1>
      <ErrorBanner error={error?.status === 404 ? null : error} />
      {loading && <p className="muted">Загрузка…</p>}
      {!loading && error?.status === 404 && (
        <div className="card empty">
          <p>Задача не найдена.</p>
          <Link className="button" to="/">К списку</Link>
        </div>
      )}
      {!loading && error?.status !== 404 && (
        <TaskForm
          initial={initial ?? EMPTY_TASK}
          pending={pending}
          error={error}
          onSubmit={onSubmit}
          submitLabel={isEdit ? 'Сохранить' : 'Создать'}
        />
      )}
    </section>
  );
}
