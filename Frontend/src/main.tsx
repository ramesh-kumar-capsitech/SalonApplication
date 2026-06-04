// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// import 'antd/dist/reset.css';


// import { BrowserRouter } from 'react-router-dom'
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/lib/integration/react';
// import { persistor, store } from './redux/store.ts';

// createRoot(document.getElementById('root')!).render(
//   <Provider store={store}>
//     <PersistGate
//       loading={null}
//       persistor={persistor}
//     >
//       <App />
//     </PersistGate>
//   </Provider>
// )
import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";

import {
  store,
  persistor,
} from "./redux/store";



ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);