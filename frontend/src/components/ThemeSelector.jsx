import React, { useState, useEffect, useRef } from 'react';
import { PaletteIcon } from "lucide-react";
import useThemeStore from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
    const { theme, setTheme } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Debug: Log current theme
    useEffect(() => {
        console.log("Current theme in ThemeSelector:", theme);
    }, [theme]);

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
        console.log("Changing theme to:", themeName);
        setTheme(themeName);
        setIsOpen(false);
        
        // Debug: Check if theme was applied after a short delay
        setTimeout(() => {
            console.log("Theme after change:", themeName);
        }, 100);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Debug: Log available themes
    console.log("Available themes:", THEMES);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="p-2 rounded-full hover:bg-base-200 transition-colors"
                title="Select Theme"
            >
                <PaletteIcon size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-2">
                        {THEMES.map((themeOption) => (
                            <div
                                key={themeOption.name}
                                className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-base-200 ${
                                    theme === themeOption.name ? 'bg-base-200' : ''
                                }`}
                                onClick={() => handleThemeChange(themeOption.name)}
                            >
                                <span className="font-medium">{themeOption.label}</span>
                                {/* THEME PREVIEW COLORS */}
                                <div className="flex gap-1">
                                    {themeOption.colors.map((color, i) => (
                                        <div
                                            key={i}
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;