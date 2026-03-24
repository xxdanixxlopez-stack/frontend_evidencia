import { useEffect, useState } from "react";
import { api } from "../api/api";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [cats, setCats] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  // Función para cargar todos los productos y categorías
  async function loadInitialData() {
    setMsg("");
    try {
      const [cRes, pRes] = await Promise.all([
        api.get("/api/categories"),
        api.get("/api/products")
      ]);

      // --- AJUSTE PARA DANIEL: Mapeo de categorías desde MongoDB ---
      // Vi en tu captura que el campo se llama "Nombre" (con N mayúscula)
      // Lo convertimos a "name" para que el componente lo reconozca
      const categoriasLimpias = cRes.data.map(cat => ({
        ...cat,
        name: cat.Nombre || cat.name || "Sin nombre" 
      }));

      setCats(categoriasLimpias);
      setProducts(pRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setMsg("Error de conexión con el servidor.");
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filtrar por categoría seleccionada
  async function filterByCategory(id) {
    setCategoryId(id);
    setQ(""); // Limpiamos la búsqueda al filtrar por categoría
    setMsg("");
    const url = id ? `/api/products?categoryId=${id}` : "/api/products";
    try {
      const res = await api.get(url);
      setProducts(res.data);
      if (res.data.length === 0) setMsg("No hay productos en esta categoría.");
    } catch (error) {
      console.error("Error al filtrar:", error);
    }
  }

  // Función de búsqueda
  async function handleSearch(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setCategoryId(""); // Limpiamos la categoría al buscar texto
    try {
      const res = await api.get(`/api/search?q=${encodeURIComponent(q.trim())}`);
      setProducts(res.data);
      if (res.data.length === 0) {
        setMsg(`No encontramos nada para "${q}"`);
      } else {
        setMsg("");
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  }

  return (
    <main className="main-wrapper">
      {/* Banner Principal con temática del logo */}
      <header className="hero-section">
        <h1 className="hero-title">The House of Beauty</h1>
        <p className="hero-subtitle">Cosmética & Novedades de Alta Gama</p>
      </header>

      <div className="container">
        {/* Panel de Control: Buscador y Filtros juntos en la caja blanca */}
        <section className="filter-wrapper">
          <SearchBar 
            q={q} 
            setQ={setQ} 
            onSearch={handleSearch} 
            onReset={loadInitialData} 
          />
          
          <div style={{ margin: '25px 0', height: '1px', background: '#eee' }}></div>
          
          <CategoryFilter 
            cats={cats} 
            selectedId={categoryId} 
            onSelect={filterByCategory} 
          />
        </section>

        {/* Mensaje de estado (Cargando o Sin resultados) */}
        {msg && (
          <div className="toast">
            {msg}
          </div>
        )}

        {/* Rejilla de Productos corregida */}
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            !msg && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
                <p>Cargando catálogo premium...</p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}