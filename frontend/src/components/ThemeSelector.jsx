import React, { useState, useEffect, useRef } from 'react';
import { PaletteIcon } from "lucide-react";
import useThemeStore from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
    const { theme, setTheme } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleThemeChange = (themeName) => {
        setTheme(themeName);
        setIsOpen(false); // Close dropdown after selection
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={toggleDropdown}
                className="btn btn-ghost btn-circle"
                type="button"
            >
                <PaletteIcon className="size-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
                w-56 border border-base-content/10 max-h-80 overflow-y-auto z-[9999]">
                    <div className="space-y-1">
                        {THEMES.map((themeOption) => (
                            <button
                                key={themeOption.name}
                                className={`
                                    w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
                                    ${
                                        theme === themeOption.name
                                            ? "bg-primary/10 text-primary"
                                            : "hover:bg-base-content/5"
                                    }
                                `}
                                onClick={() => handleThemeChange(themeOption.name)}
                            >
                                <PaletteIcon className="size-4" />
                                <span className="text-sm font-medium">{themeOption.label}</span>
                                {/* THEME PREVIEW COLORS */}
                                <div className="ml-auto flex gap-1">
                                    {themeOption.colors.map((color, i) => (
                                        <span
                                            key={i}
                                            className="size-2 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;