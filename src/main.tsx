import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { enableMocking } from './api/browser';

async function prepareApp() {
  // Start MSW mock service worker in development and production demo
  await enableMocking();
}

prepareApp().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element not found');

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
