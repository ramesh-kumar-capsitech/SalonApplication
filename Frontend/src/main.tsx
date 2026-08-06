import ReactDOM from "react-dom/client";
import './index.css'
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";

import {
  store,
  persistor,
} from "./redux/store";

const queryClient = new QueryClient();


ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);