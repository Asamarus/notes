import { createRoot } from 'react-dom/client';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';

const container = document.getElementById('app');
const root = createRoot(container as Element);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
