import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export const SearchableDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "اختر خيار...",
  allowCustomInput = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(value || "");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);

    if (allowCustomInput) {
      onChange(newValue);
    }

    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleOptionSelect = (option) => {
    setInputValue(option);
    setSearchTerm("");
    setIsOpen(false);
    onChange(option);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(inputValue);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-0 top-0 h-full px-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <ChevronDown
            size={16}
            className={`transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className="w-full px-3 py-2 text-right hover:bg-gray-50 flex items-center justify-between"
              >
                <span>{option}</span>
                {value === option && (
                  <Check size={16} className="text-blue-600" />
                )}
              </button>
            ))
          ) : searchTerm && allowCustomInput ? (
            <div className="px-3 py-2 text-gray-500 text-right">
              اضغط Enter لإضافة "{searchTerm}"
            </div>
          ) : (
            <div className="px-3 py-2 text-gray-500 text-right">
              لا توجد نتائج
            </div>
          )}
        </div>
      )}
    </div>
  );
};
