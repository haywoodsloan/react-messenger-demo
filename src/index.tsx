import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.scss';
import reportWebVitals from './reportWebVitals';
import routes from './routes';
import { store } from './store';

const container = document.getElementById('root');
if (!container) {
  // Should also log error to analytics service
  throw new Error('Failed to find root container');
}

const router = createBrowserRouter(routes);
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals((metric) => {
  // Eventually this should send the data to an analytics service
  // like App Insights, for now just log to the console
  console.log(metric);
});
