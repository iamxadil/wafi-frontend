import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Boxes,
  CheckSquare,
  Edit,
} from "lucide-react";
import "./styles/adminheader.css";

const AdminHeader = ({
  title = "Dashboard",
  breadcrumb = [],
  Icon = Boxes,
  onSearch,
  onFilterChange,
  onSortChange,
  onAdd,
  onEdit,
  onDelete,
  filterOptions = [],
  sortOptions = [],
  totalCount,
  selectedCount,
  onSelectAll,
  onDeselectAll,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Default");

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setShowFilter(false);
      if (sortRef.current && !sortRef.current.contains(e.target))
        setShowSort(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers
  const handleSearch = (e) => onSearch?.(e.target.value);
  const handleFilterSelect = (opt) => {
    setSelectedFilter(opt);
    setShowFilter(false);
    onFilterChange?.(opt);
  };
  const handleSortSelect = (opt) => {
    setSelectedSort(opt);
    setShowSort(false);
    onSortChange?.(opt);
  };

  return (
    <header className="admin-header">
      
      {/* === LEFT === */}
      <div className="admin-left">
        <div className="admin-title">
          {Icon && (
            <div className="icon-box">
              <Icon size={20} strokeWidth={1.8} />
            </div>
          )}
          <div className="title-wrap">
            <h1>{title}</h1>
            {breadcrumb?.length > 0 && (
              <p className="breadcrumb">{breadcrumb.join(" / ")}</p>
            )}
          </div>
        </div>
      </div>

      {/* === CENTER === */}
      <div className="admin-center">
        {onSearch && (
          <div className="admin-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
            />
          </div>
        )}

        {filterOptions.length > 0 && (
          <div className="dropdown" ref={filterRef}>
            <button
              className="dropdown-btn"
              onClick={() => setShowFilter((p) => !p)}
            >
              <Filter size={16} />
              <span>{selectedFilter}</span>
            </button>
            {showFilter && (
              <div className="dropdown-menu">
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    className="dropdown-item"
                    onClick={() => handleFilterSelect(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {sortOptions.length > 0 && (
          <div className="dropdown" ref={sortRef}>
            <button
              className="dropdown-btn"
              onClick={() => setShowSort((p) => !p)}
            >
              <ArrowUpDown size={16} />
              <span>{selectedSort}</span>
            </button>
            {showSort && (
              <div className="dropdown-menu">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    className="dropdown-item"
                    onClick={() => handleSortSelect(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* === RIGHT === */}
      <div className="admin-right">
        {(onAdd || onEdit || onDelete) && (
          <div className="btn-group">
            {onAdd && (
              <button className="admin-btn add" onClick={onAdd}>
                <Plus size={15} /> Add
              </button>
            )}
            {onEdit && (
              <button className="admin-btn edit" onClick={onEdit}>
                <Edit size={15} /> Edit
              </button>
            )}
            {onDelete && (
              <button className="admin-btn delete" onClick={onDelete}>
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        )}

        {(onSelectAll || onDeselectAll) && (
          <div className="check-group">
            {onSelectAll && (
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => e.target.checked && onSelectAll()}
                />
                All
              </label>
            )}
            {onDeselectAll && (
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => e.target.checked && onDeselectAll()}
                />
                None
              </label>
            )}
          </div>
        )}

        {(totalCount !== undefined || selectedCount !== undefined) && (
          <div className="stats">
            {totalCount !== undefined && (
              <span>
                <Boxes size={14} /> Total: <strong>{totalCount}</strong>
              </span>
            )}
            {selectedCount !== undefined && (
              <span>
                <CheckSquare size={14} /> Selected:{" "}
                <strong>{selectedCount}</strong>
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
