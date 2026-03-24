import React from 'react';

export default function CategoryFilter({ cats, selectedId, onSelect }) {
  if (!cats || cats.length === 0) return null;

  const categoriasUnicas = cats.filter((value, index, self) =>
    index === self.findIndex((t) => t.name === value.name)
  );

  return (
    <div className="filter-wrapper">
      <h3 style={{textAlign:'center', marginBottom:'15px', fontFamily:'Playfair Display', color:'#1a1a1a'}}>Categorías</h3>
      <div className="filter-container">
        <button
          className={`filter-btn ${selectedId === "" ? "active" : ""}`}
          onClick={() => onSelect("")}
        >
          Todas
        </button>

        {categoriasUnicas.map((c) => (
          <button
            key={c._id}
            className={`filter-btn ${selectedId === c._id ? "active" : ""}`}
            onClick={() => onSelect(c._id)}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}