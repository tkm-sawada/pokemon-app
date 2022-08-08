import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { NowPageProvider } from './components/providers/NowPageProvider';
import { PokemonDataProvider } from './components/providers/PokemonDataProvider';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
    <NowPageProvider>
      <PokemonDataProvider>
        <App />
      </PokemonDataProvider>
    </NowPageProvider>
  //</React.StrictMode>
);
