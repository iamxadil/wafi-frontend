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
  ListFilter,
} from "lucide-react";
import "./styles/adminheader.css";
import { position } from "stylis";

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
  optFilterOptions = [],        
  optFilterTitle = "Filter",    
  onOptFilterChange,            
  totalCount,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  isSticky = false
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showOptFilter, setShowOptFilter] = useState(false); // ⭐ NEW DROPDOWN

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Default");
  const [selectedOptFilters, setSelectedOptFilters] = useState([]); // ⭐ ARRAY

  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const optFilterRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setShowFilter(false);
      if (sortRef.current && !sortRef.current.contains(e.target))
        setShowSort(false);
      if (optFilterRef.current && !optFilterRef.current.contains(e.target))
        setShowOptFilter(false); // ⭐ CLOSE MULTI FILTER
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

  // ⭐ Multi-select handler
  const handleOptFilterToggle = (opt) => {
    let updated;
    if (selectedOptFilters.includes(opt)) {
      updated = selectedOptFilters.filter((item) => item !== opt);
    } else {
      updated = [...selectedOptFilters, opt];
    }
    setSelectedOptFilters(updated);
    onOptFilterChange?.(updated); // return full list
  };

  return (
    <header className="admin-header" style={ {position: isSticky && "sticky"}}>
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
        {/* Search */}
        {onSearch && (
          <div className="admin-search">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search..." onChange={handleSearch} />
          </div>
        )}

        {/* SINGLE FILTER */}
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

        {/* ⭐ MULTI-FILTER */}
        {optFilterOptions.length > 0 && (
          <div className="dropdown" ref={optFilterRef}>
            <button
              className="dropdown-btn"
              onClick={() => setShowOptFilter((p) => !p)}
            >
              <ListFilter size={16} />
              <span>{optFilterTitle}</span>
            </button>

            {showOptFilter && (
              <div className="dropdown-menu multi-select">
                {optFilterOptions.map((opt) => (
                  <label key={opt} className="dropdown-item check-item">
                    <input
                      type="checkbox"
                      checked={selectedOptFilters.includes(opt)}
                      onChange={() => handleOptFilterToggle(opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SORT */}
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
