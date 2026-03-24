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

  // --- PLAN B: Extraer categorías únicas de los productos ---
  async function loadInitialData() {
    setMsg("");
    try {
      const pRes = await api.get("/api/products");
      const productosData = pRes.data;

      // 1. Sacamos los nombres de las categorías de los productos
      // Usamos .map para obtenerlas y new Set para que NO se repitan
      const nombresCategorias = [...new Set(productosData.map(p => {
        // Buscamos el nombre de la categoría sin importar cómo venga de la BD
        if (typeof p.category === 'object') {
          return p.category.Nombre || p.category.name || "General";
        }
        return p.category || "General";
      }))];

      // 2. Convertimos esos nombres en objetos que el componente entienda
      const categoriasLimpias = nombresCategorias.map((nombre, index) => ({
        _id: nombre, // Usamos el nombre como ID para que el filtro funcione
        name: nombre
      }));

      setCats(categoriasLimpias);
      setProducts(productosData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setMsg("Error de conexión con el servidor.");
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filtrar por categoría seleccionada (Modificado para el Plan B)
  function filterByCategory(name) {
    setCategoryId(name);
    setQ(""); 
    setMsg("");

    if (!name) {
      loadInitialData(); // Si es "Todas", recargamos todo
      return;
    }

    // Filtramos localmente para que sea instantáneo y no falle con la API
    const filtrados = products.filter(p => {
      const catName = typeof p.category === 'object' 
        ? (p.category.Nombre || p.category.name) 
        : p.category;
      return catName === name;
    });

    setProducts(filtrados);
    if (filtrados.length === 0) setMsg("No hay productos en esta categoría.");
  }

  // Función de búsqueda
  async function handleSearch(e) {
    e.preventDefault();
    if (!q.trim()) return;
    setCategoryId(""); 
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
      <header className="hero-section">
        <h1 className="hero-title">The House of Beauty</h1>
        <p className="hero-subtitle">Cosmética & Novedades de Alta Gama</p>
      </header>

      <div className="container">
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

        {msg && <div className="toast">{msg}</div>}

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