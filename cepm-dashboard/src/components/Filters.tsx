import { ChangeEvent } from 'react';

interface FiltersProps {
  years: number[];
  selectedYear: number | 'all';
  searchTerm: string;
  onYearChange: (value: number | 'all') => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

const Filters = ({
  years,
  selectedYear,
  searchTerm,
  onYearChange,
  onSearchChange,
  onReset,
}: FiltersProps) => {
  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value === 'all' ? 'all' : Number(event.target.value);
    onYearChange(value);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <section className="filters">
      <div className="filter">
        <label htmlFor="year-select">Ano</label>
        <select id="year-select" value={selectedYear} onChange={handleYearChange}>
          <option value="all">Todos os anos</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="filter search">
        <label htmlFor="search-input">Buscar</label>
        <input
          id="search-input"
          type="search"
          placeholder="Turma ou cidade"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-actions">
        <button type="button" onClick={handleReset}>
          Limpar filtros
        </button>
      </div>
    </section>
  );
};

export default Filters;
