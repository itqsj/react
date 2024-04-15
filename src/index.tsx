import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)

const root = document.getElementById('root');
if(root) {
  createRoot(root).render(
    <HashRouter>
      <App />
    </HashRouter>
  )
}