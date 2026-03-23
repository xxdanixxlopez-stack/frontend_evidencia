import React from 'react';

export default function SearchBar({ q, setQ, onSearch, onReset }) {
  return (
    <form className="search-wrapper" onSubmit={onSearch}>
      <div className="search-input-group">
        <input
          type="text"
          className="search-input"
          placeholder="¿Qué producto buscas hoy?..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" className="btn-search">
          Buscar
        </button>
        <button type="button" className="btn-reset" onClick={onReset}>
          Limpiar
        </button>
      </div>
    </form>
  );
}