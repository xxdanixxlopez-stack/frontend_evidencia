import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  // Estado para rastrear si estamos editando un producto específico
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = { name: "", brand: "", description: "", price: "", imageUrl: "", category: "", available: true };
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [pRes, cRes] = await Promise.all([api.get("/api/products"), api.get("/api/categories")]);
      setProducts(pRes.data);
      setCats(cRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }

  // --- LÓGICA DE ENVÍO (CREAR O ACTUALIZAR) ---
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        // MODO EDICIÓN: Usamos PUT
        await api.put(`/api/products/${editingId}`, form);
        alert("Producto actualizado correctamente");
      } else {
        // MODO CREACIÓN: Usamos POST
        await api.post("/api/products", form);
        alert("Producto agregado correctamente");
      }
      
      // Resetear formulario y salir del modo edición
      setForm(initialFormState);
      setEditingId(null);
      loadData(); // Recargar lista
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el producto.");
    }
  }

  // --- ACTIVAR MODO EDICIÓN ---
  function startEdit(product) {
    setEditingId(product._id); // Guardamos el ID que estamos editando
    // Rellenamos el formulario con los datos actuales
    setForm({
      name: product.name,
      brand: product.brand || "",
      description: product.description || "",
      price: product.price,
      imageUrl: product.imageUrl || "",
      category: product.category?._id || product.category || "", // Manejo si category es objeto o ID
      available: product.available
    });
    // Scroll hacia arriba para ver el formulario
    window.scrollTo(0, 0);
  }

  // --- CANCELAR EDICIÓN ---
  function cancelEdit() {
    setEditingId(null);
    setForm(initialFormState);
  }

  async function deleteProduct(id) {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await api.delete(`/api/products/${id}`);
        loadData();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  }

  return (
    <div className="container">
      <div className="admin-container">
        {/* Título dinámico */}
        <h1 className="admin-title">
          {editingId ? `Editando: ${form.name}` : "Administrar Productos"}
        </h1>
        
        <form className="admin-form" onSubmit={handleSubmit}>
          <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input placeholder="Marca" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
          <input type="number" placeholder="Precio" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <input placeholder="URL Imagen" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
            <option value="">Selecciona categoría</option>
            {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <textarea placeholder="Descripción" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          
          <div className="action-buttons-form" style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}>
            {/* Botón dinámico: Guardar o Actualizar */}
            <button className="btn-admin btn-add" type="submit">
              {editingId ? "Actualizar Producto" : "Agregar Producto"}
            </button>
            
            {/* Botón para cancelar si estamos editando */}
            {editingId && (
              <button className="btn-admin btn-ghost" type="button" onClick={cancelEdit}>
                Cancelar Edición
              </button>
            )}
          </div>
        </form>

        <div className="admin-list">
          <h2 style={{ marginBottom: '15px', fontSize: '1.2rem', color: '#666' }}>Lista de Productos ({products.length})</h2>
          {products.map(p => (
            <div key={p._id} className="admin-list-item" style={editingId === p._id ? {backgroundColor: '#fffbeb', borderColor: '#D4AF37'} : {}}>
              <div className="admin-item-info">
                <h4>{p.name}</h4>
                <p>{p.brand} - ${p.price}</p>
                {editingId === p._id && <span style={{color: '#D4AF37', fontSize: '0.7rem', fontWeight: 'bold'}}>EDITANDO</span>}
              </div>
              <div className="action-buttons">
                {/* Botón Editar ahora tiene lógica */}
                <button className="btn-admin btn-edit" onClick={() => startEdit(p)}>Editar</button>
                <button className="btn-admin btn-delete" onClick={() => deleteProduct(p._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}