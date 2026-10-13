// ---------------------------------------------------------------------------
// src/main.jsx — Application Entry Point
// ---------------------------------------------------------------------------
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.jsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
