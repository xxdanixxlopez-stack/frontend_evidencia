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

  async function loadInitialData() {
    setMsg("");
    try {
      const pRes = await api.get("/api/products");
      const productosData = pRes.data;

      // --- LOGICA DE LIMPIEZA EXTREMA ---
      // 1. Extraemos los nombres de las categorías
      const nombresCrudos = productosData.map(p => {
        const nombreProd = p.name;
        const nombreCat = typeof p.category === 'object' 
          ? (p.category.Nombre || p.category.name) 
          : p.category;
        
        // REGLA DE ORO: Si la categoría es igual al nombre del producto, es basura
        // La marcamos como "General" para que no llene la pantalla
        if (!nombreCat || nombreCat === nombreProd) return "General";
        return nombreCat;
      });

      // 2. Eliminamos duplicados con Set
      const categoriasUnicas = [...new Set(nombresCrudos)].map(nombre => ({
        _id: nombre,
        name: nombre
      }));

      setCats(categoriasUnicas);
      setProducts(productosData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setMsg("Error de conexión con el servidor.");
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  function filterByCategory(name) {
    setCategoryId(name);
    setQ(""); 
    setMsg("");

    if (!name) {
      loadInitialData();
      return;
    }

    const filtrados = products.filter(p => {
      const catName = typeof p.category === 'object' 
        ? (p.category.Nombre || p.category.name) 
        : p.category;
      return catName === name || (!catName && name === "General");
    });

    setProducts(filtrados);
    if (filtrados.length === 0) setMsg("No hay productos en esta categoría.");
  }

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
        {/* SI VES "TEST", EL CODIGO SE ACTUALIZO CORRECTAMENTE */}
        <h1 className="hero-title">The House of Beauty TEST</h1>
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