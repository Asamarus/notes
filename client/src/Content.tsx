import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import ComponentLoader from 'common/component_loader';
const Login = lazy(() => import('./pages/login'));
const Note = lazy(() => import('./pages/note'));
const Notes = lazy(() => import('./pages/notes_list'));
const NotFound = lazy(() => import('./pages/not_found'));

function Content() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ComponentLoader>
            <Notes />
          </ComponentLoader>
        }
      />
      <Route
        path="login"
        element={
          <ComponentLoader>
            <Login />
          </ComponentLoader>
        }
      />
      <Route
        path=":section/:id"
        element={
          <ComponentLoader>
            <Note />
          </ComponentLoader>
        }
      />
      <Route
        path=":section"
        element={
          <ComponentLoader>
            <Notes />
          </ComponentLoader>
        }
      />
      <Route
        path="*"
        element={
          <ComponentLoader>
            <NotFound />
          </ComponentLoader>
        }
      />
    </Routes>
  );
}

export default Content;
