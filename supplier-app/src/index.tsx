import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';


import './global.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/md-light-indigo/theme.css';


import Login from './pages/Login';
import Home from './pages/Home';
import Suppliers from './APIs/suppliers';
import Data from './pages/Data';



         

const language = navigator.language.split(/[-_]/)[0];


i18n.init({
  interpolation: { escapeValue: false },
  lng: language,
  resources: {
    en: {
      translation: require('./locales/en.json'),
    },
    de: {
      translation: require('./locales/de.json'),
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home/:supplier_key',
    element: <Home />,
  },
  {
    path: '/data/:supplier_key',
    element: <Data />,
  },
]);


const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <PrimeReactProvider value={ { appendTo: 'self' } }>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
);
