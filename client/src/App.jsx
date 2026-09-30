import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TasksApi } from './api/TasksApi';
import { ApiContext } from './api/context';
import { Layout } from './components/Layout';
import { NotFoundPage } from './pages/NotFoundPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { TaskFormPage } from './pages/TaskFormPage';
import { TaskListPage } from './pages/TaskListPage';

const api = new TasksApi('/api');

export default function App() {
  return (
    <ApiContext.Provider value={api}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<TaskListPage />} />
            <Route path="tasks/new" element={<TaskFormPage />} />
            <Route path="tasks/:id" element={<TaskDetailPage />} />
            <Route path="tasks/:id/edit" element={<TaskFormPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>
  );
}
