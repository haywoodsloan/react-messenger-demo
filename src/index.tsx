import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Metric } from 'web-vitals';

import App from './App';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { store } from './store';

const container = document.getElementById('root');
if (!container) {
  // Should also log error to analytics service
  throw new Error('Failed to find root container');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

function sendAnalytics(metric: Metric) {
  // Eventually this should send the data to an analytics service
  // like App Insights for now just log to the console
  console.log(metric);
}

reportWebVitals(sendAnalytics);
