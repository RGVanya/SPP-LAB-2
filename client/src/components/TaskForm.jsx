import { useEffect, useState } from 'react';
import { STATUS_OPTIONS } from '../constants';

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'new',
  dueDate: '',
};

export function TaskForm({ initial, pending, error, onSubmit, submitLabel }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const fields = error?.fields || {};

  useEffect(() => {
    setForm({ ...EMPTY_FORM, ...initial });
  }, [initial]);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span>Название</span>
        <input
          name="title"
          value={form.title}
          onChange={update}
          maxLength={200}
          aria-invalid={Boolean(fields.title)}
        />
        {fields.title && <span className="field-error">{fields.title}</span>}
      </label>

      <label className="field">
        <span>Описание</span>
        <textarea
          name="description"
          value={form.description}
          onChange={update}
          rows={5}
          maxLength={2000}
          aria-invalid={Boolean(fields.description)}
        />
        {fields.description && <span className="field-error">{fields.description}</span>}
      </label>

      <div className="form-row">
        <label className="field">
          <span>Статус</span>
          <select
            name="status"
            value={form.status}
            onChange={update}
            aria-invalid={Boolean(fields.status)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {fields.status && <span className="field-error">{fields.status}</span>}
        </label>

        <label className="field">
          <span>Срок</span>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate || ''}
            onChange={update}
            aria-invalid={Boolean(fields.dueDate)}
          />
          {fields.dueDate && <span className="field-error">{fields.dueDate}</span>}
        </label>
      </div>

      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? 'Сохранение…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
