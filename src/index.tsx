import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { NowPageProvider } from './components/providers/NowPageProvider';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <NowPageProvider>
      <App />
    </NowPageProvider>
  </React.StrictMode>
);
