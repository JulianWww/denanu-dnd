import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// <React.StrictMode>

root.render(
  
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
);
reportWebVitals();
