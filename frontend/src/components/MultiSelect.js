import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX, FiChevronDown } from 'react-icons/fi';

const MultiSelect = ({ options, selectedValues, onChange, placeholder = 'Select options...' }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const removeTag = (e, option) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== option));
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="w-full min-h-[50px] px-4 py-2.5 border border-gray-200 rounded-xl bg-white cursor-pointer flex items-center flex-wrap gap-1.5 transition-all duration-200 hover:border-gray-300"
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        ) : (
          selectedValues.map((val) => (
            <span
              key={val}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium"
            >
              {val}
              <FiX
                size={12}
                className="cursor-pointer hover:text-primary-dark"
                onClick={(e) => removeTag(e, val)}
              />
            </span>
          ))
        )}
        <FiChevronDown
          size={18}
          className={`ml-auto text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </div>
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 h-[38px] text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No options found</p>
            ) : (
              filtered.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => toggleOption(option)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                  />
                  <span className="text-text">{option}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
