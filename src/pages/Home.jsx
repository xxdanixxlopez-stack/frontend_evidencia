import { useEffect, useState } from "react";
import { api } from "../api/api";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [cats, setCats] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  function getCategoryName(product) {
    const cat = product.categoria ?? product.category;

    if (typeof cat === "object" && cat !== null) {
      return (cat.Nombre || cat.name || "").trim();
    }

    return (cat || "").trim();
  }

  async function loadInitialData() {
    setMsg("");
    try {
      const pRes = await api.get("/api/products");
      const productosData = pRes.data;

      setAllProducts(productosData);
      setProducts(productosData);

      const categoriasUnicas = [
        ...new Set(
          productosData
            .map((p) => getCategoryName(p))
            .filter((nombre) => nombre !== "")
        ),
      ].map((nombre) => ({
        _id: nombre,
        name: nombre,
      }));

      setCats(categoriasUnicas);
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
      setProducts(allProducts);
      return;
    }

    const filtrados = allProducts.filter((p) => {
      const catName = getCategoryName(p);
      return catName.toLowerCase() === name.toLowerCase();
    });

    setProducts(filtrados);

    if (filtrados.length === 0) {
      setMsg("No hay productos en esta categoría.");
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    setMsg("");

    if (!q.trim()) {
      setProducts(allProducts);
      return;
    }

    setCategoryId("");

    try {
      const texto = q.trim().toLowerCase();

      const filtrados = allProducts.filter((p) => {
        const nombre = (p.name || p.nombre || "").toLowerCase();
        const descripcion = (p.description || p.descripcion || "").toLowerCase();
        const categoria = getCategoryName(p).toLowerCase();

        return (
          nombre.includes(texto) ||
          descripcion.includes(texto) ||
          categoria.includes(texto)
        );
      });

      setProducts(filtrados);

      if (filtrados.length === 0) {
        setMsg(`No encontramos nada para "${q}"`);
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setMsg("Error al buscar productos.");
    }
  }

  function handleReset() {
    setQ("");
    setCategoryId("");
    setMsg("");
    setProducts(allProducts);
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
            onReset={handleReset}
          />

          <div style={{ margin: "25px 0", height: "1px", background: "#eee" }}></div>

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
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px" }}>
                <p>No hay productos disponibles.</p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}