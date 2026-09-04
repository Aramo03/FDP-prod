'use client';

import { useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../lib/api';
import styles from './TaskDashboard.module.css';

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [leavingIds, setLeavingIds] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getTasks();
        if (!cancelled) {
          setTasks(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load tasks.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || saving) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const created = await createTask({
        title: title.trim(),
        description: description.trim(),
      });
      setTasks((current) => [created, ...current]);
      setTitle('');
      setDescription('');
      setSuccess('Task created.');
      window.setTimeout(() => setSuccess(''), 1800);
    } catch (err) {
      setError(err.message || 'Could not create the task.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(task) {
    setError('');
    try {
      const updated = await updateTask(task.id, { completed: !task.completed });
      setTasks((current) => current.map((item) => (item.id === task.id ? updated : item)));
    } catch (err) {
      setError(err.message || 'Could not update the task.');
    }
  }

  async function handleDelete(id) {
    setError('');
    setLeavingIds((current) => [...current, id]);
    try {
      await deleteTask(id);
      window.setTimeout(() => {
        setTasks((current) => current.filter((item) => item.id !== id));
        setLeavingIds((current) => current.filter((item) => item !== id));
      }, 280);
    } catch (err) {
      setLeavingIds((current) => current.filter((item) => item !== id));
      setError(err.message || 'Could not delete the task.');
    }
  }

  return (
    <section className={`section ${styles.wrap}`} id="dashboard">
      <p className="section-kicker" data-reveal>
        Live workspace
      </p>
      <h2 className="section-title" data-reveal>
        Task dashboard
      </h2>
      <p className="section-copy" data-reveal>
        Capture work, complete it, and keep the list clean. This is the real API — not a mock.
      </p>

      <form className={styles.form} onSubmit={handleSubmit} data-reveal="scale">
        <div className={styles.field}>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder=" "
            required
            maxLength={200}
          />
          <label htmlFor="task-title">Task title</label>
        </div>
        <div className={`${styles.field} ${styles.area}`}>
          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder=" "
            rows={3}
          />
          <label htmlFor="task-description">Notes (optional)</label>
        </div>
        <button className={styles.submit} type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Add task'}
        </button>
      </form>

      {error ? <p className={styles.error} role="alert">{error}</p> : null}
      {success ? <p className={styles.success} role="status">{success}</p> : null}

      {loading ? (
        <div className={styles.loading} aria-live="polite">
          <div className="dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p>Loading your tasks</p>
        </div>
      ) : null}

      {!loading && tasks.length === 0 && !error ? (
        <div className={styles.empty} data-reveal>
          <span className={styles.emptyOrb} aria-hidden="true" />
          <h3>No tasks yet.</h3>
          <p>Create your first task and start moving.</p>
        </div>
      ) : null}

      <ul className={styles.list}>
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className={`${styles.card} ${task.completed ? styles.done : ''} ${leavingIds.includes(task.id) ? styles.leaving : ''}`}
            style={{ '--i': Math.min(index, 6) }}
            data-reveal
            data-stagger
          >
            <button
              className={styles.check}
              type="button"
              aria-pressed={task.completed}
              aria-label={task.completed ? 'Mark as active' : 'Mark as complete'}
              onClick={() => handleToggle(task)}
            >
              <span />
            </button>
            <div className={styles.body}>
              <h3>{task.title}</h3>
              {task.description ? <p>{task.description}</p> : null}
            </div>
            <button className={styles.delete} type="button" onClick={() => handleDelete(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
