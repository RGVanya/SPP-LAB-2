import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../api/context';
import { ErrorBanner, NoticeBanner } from '../components/Banners';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate, formatDateTime, formatFileSize } from '../format';

export function TaskDetailPage() {
  const api = useApi();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(location.state?.message || '');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(id)
      .then((data) => {
        if (active) setTask(data.task);
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
  }, [api, id]);

  async function reload() {
    const data = await api.get(id);
    setTask(data.task);
  }

  async function onUpload(event) {
    event.preventDefault();
    setUploading(true);
    setError(null);
    try {
      await api.upload(id, file);
      setFile(null);
      event.target.reset();
      await reload();
      setNotice('Файл прикреплён');
    } catch (requestError) {
      setError(requestError);
    } finally {
      setUploading(false);
    }
  }

  async function onDownload(attachment) {
    setError(null);
    try {
      await api.download(task.id, attachment.id, attachment.originalName);
    } catch (requestError) {
      setError(requestError);
    }
  }

  async function onDeleteAttachment(attachmentId) {
    setPending(true);
    setError(null);
    try {
      await api.removeAttachment(id, attachmentId);
      await reload();
      setNotice('Вложение удалено');
    } catch (requestError) {
      setError(requestError);
    } finally {
      setPending(false);
    }
  }

  async function onDeleteTask() {
    if (!task || !window.confirm(`Удалить задачу «${task.title}»?`)) return;
    setPending(true);
    setError(null);
    try {
      await api.remove(id);
      navigate('/', { state: { message: `Задача «${task.title}» удалена` } });
    } catch (requestError) {
      setError(requestError);
      setPending(false);
    }
  }

  if (loading) return <p className="muted">Загрузка…</p>;

  if (error?.status === 404 && !task) {
    return (
      <section>
        <ErrorBanner error={error} />
        <Link className="button" to="/">К списку</Link>
      </section>
    );
  }

  if (!task) {
    return (
      <section>
        <ErrorBanner error={error} />
      </section>
    );
  }

  return (
    <section>
      <Link className="back-link" to="/">К списку</Link>
      <NoticeBanner message={notice} />
      <ErrorBanner error={error} />

      <article className="card detail">
        <div className="detail-head">
          <h1>{task.title}</h1>
          <StatusBadge status={task.status} />
        </div>
        {task.description ? <p>{task.description}</p> : <p className="muted">Без описания</p>}
        <p className="meta">Срок: {formatDate(task.dueDate)}</p>
        <div className="form-actions">
          <Link className="button button-primary" to={`/tasks/${task.id}/edit`}>Изменить</Link>
          <button className="button button-danger" type="button" disabled={pending} onClick={onDeleteTask}>
            Удалить
          </button>
        </div>
      </article>

      <section className="card">
        <h2>Вложения</h2>
        {task.attachments.length === 0 && <p className="muted">Файлов пока нет.</p>}
        <ul className="attachment-list">
          {task.attachments.map((attachment) => (
            <li key={attachment.id}>
              <div>
                <button
                  className="link-button"
                  type="button"
                  onClick={() => onDownload(attachment)}
                >
                  {attachment.originalName}
                </button>
                <p className="meta">
                  {formatFileSize(attachment.size)} · {formatDateTime(attachment.uploadedAt)}
                </p>
              </div>
              <button
                className="button button-danger"
                type="button"
                disabled={pending}
                onClick={() => onDeleteAttachment(attachment.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>

        <form className="upload-form" onSubmit={onUpload}>
          <label className="field">
            <span>Файл</span>
            <input
              type="file"
              name="file"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            {error?.fields?.file && <span className="field-error">{error.fields.file}</span>}
          </label>
          <button className="button" type="submit" disabled={uploading || pending}>
            {uploading ? 'Загрузка…' : 'Прикрепить'}
          </button>
        </form>
      </section>
    </section>
  );
}
