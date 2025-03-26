import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Catalog from "../features/catalog/Catalog";
import ProductDetails from "../features/catalog/ProductDetails";
import BasketPage from "../features/basket/BasketPage";
import Login from "../features/account/Login";
import Register from "../features/account/Register";
import NotFound from "../errors/NotFound";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Regular routes
      { path: '', element: <Navigate replace to='/catalog' /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'catalog/:id', element: <ProductDetails /> },
      { path: 'basket', element: <BasketPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'not-found', element: <NotFound /> },
      
      // Protected routes
      { 
        element: <RequireAuth />,
        children: [
          { path: 'checkout', element: <h1>Checkout Page (Protected)</h1> },
        ]
      },
      
      // Catch-all route
      { path: '*', element: <Navigate replace to='/not-found' /> }
    ]
  }
]);