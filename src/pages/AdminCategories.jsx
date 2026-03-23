import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");
  // Estado para rastrear si estamos editando una categoría específica
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { loadCats(); }, []);

  async function loadCats() {
    try {
      const res = await api.get("/api/categories");
      setCats(res.data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  }

  // --- LÓGICA DE ENVÍO (CREAR O ACTUALIZAR) ---
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        // MODO EDICIÓN: Usamos PUT
        await api.put(`/api/categories/${editingId}`, { name });
        alert("Categoría actualizada correctamente");
      } else {
        // MODO CREACIÓN: Usamos POST
        await api.post("/api/categories", { name });
        alert("Categoría agregada correctamente");
      }
      
      // Resetear formulario y salir del modo edición
      setName("");
      setEditingId(null);
      loadCats();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar la categoría.");
    }
  }

  // --- ACTIVAR MODO EDICIÓN ---
  function startEdit(cat) {
    setEditingId(cat._id); // Guardamos el ID que estamos editando
    setName(cat.name);     // Rellenamos el input con el nombre actual
  }

  // --- CANCELAR EDICIÓN ---
  function cancelEdit() {
    setEditingId(null);
    setName("");
  }

  async function deleteCat(id) {
    if (window.confirm("¿Estás seguro de eliminar esta categoría? Esto podría afectar a los productos asociados.")) {
      try {
        await api.delete(`/api/categories/${id}`);
        loadCats();
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar la categoría. Asegúrate de que no tenga productos asociados.");
      }
    }
  }

  return (
    <div className="container">
      <div className="admin-container">
        {/* Título dinámico */}
        <h1 className="admin-title">
          {editingId ? `Editando: ${name}` : "Administrar Categorías"}
        </h1>
        
        <form className="admin-form" onSubmit={handleSubmit} style={{gridTemplateColumns: '1fr auto auto', gap: '10px'}}>
          <input 
            placeholder="Nueva Categoría" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          
          {/* Botón dinámico: Agregar o Actualizar */}
          <button className="btn-admin btn-add" type="submit">
            {editingId ? "Actualizar" : "Agregar"}
          </button>
          
          {/* Botón para cancelar si estamos editando */}
          {editingId && (
            <button className="btn-admin btn-ghost" type="button" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </form>

        <div className="admin-list" style={{ marginTop: '30px' }}>
          <h2 style={{ marginBottom: '15px', fontSize: '1.2rem', color: '#666' }}>Lista de Categorías ({cats.length})</h2>
          {cats.map(c => (
            <div key={c._id} className="admin-list-item" style={editingId === c._id ? {backgroundColor: '#fffbeb', borderColor: '#D4AF37'} : {}}>
              <h4 style={editingId === c._id ? {color: '#D4AF37'} : {}}>{c.name}</h4>
              <div className="action-buttons">
                {/* AÑADIDO: Botón Editar para Categorías con lógica */}
                <button className="btn-admin btn-edit" onClick={() => startEdit(c)}>Editar</button>
                <button className="btn-admin btn-delete" onClick={() => deleteCat(c._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}