import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Post from './pages/Post';
import Author from './pages/Author';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'post/:id', Component: Post },
      { path: 'autor/:id', Component: Author },
      { path: 'login', Component: Login },
      {
        Component: ProtectedRoute,
        children: [
          { path: 'dashboard', Component: Dashboard },
          { path: 'dashboard/novo', Component: NewPost },
          { path: 'dashboard/editar/:id', Component: EditPost },
        ],
      },
    ],
  },
]);
