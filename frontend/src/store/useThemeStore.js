import {create} from "zustand";

// Helper function to safely get theme from localStorage
const getStoredTheme = () => {
    try {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("streamify-theme") || "coffee";
        }
        return "coffee";
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        return "coffee";
    }
};

const useThemeStore = create((set, get) => ({
    theme: "coffee", // Default theme
    isInitialized: false,
    
    // Initialize theme from localStorage
    initializeTheme: () => {
        const storedTheme = getStoredTheme();
        set({ theme: storedTheme, isInitialized: true });
    },
    
    setTheme: (theme) => {
        try {
            localStorage.setItem("streamify-theme", theme);
            set({ theme });
        } catch (error) {
            console.error("Error saving theme to localStorage:", error);
            // Still update the theme even if localStorage fails
            set({ theme });
        }
    },
}));

export default useThemeStore;