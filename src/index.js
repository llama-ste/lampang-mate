import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Login from "./admin-pages/Login";
import NewProduct from "./admin-pages/NewProduct";
import ProductList from "./components/ProductList";
import { CookiesProvider } from "react-cookie";
import { CategoryContextProvider } from "./store/CategoryContext";

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <CategoryContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/" element={<ProductList />} />
            </Route>
            <Route path="/admin/new-product" element={<NewProduct />} />
            <Route path="/admin/sign-in" element={<Login />} />
          </Routes>
        </Router>
      </CategoryContextProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
