import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import AdminCategories from "./pages/AdminCategories.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";

export default function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:id" element={<ProductDetail />} />

        {/* Admin (protegido por login Google) */}
        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}