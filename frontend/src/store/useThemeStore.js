import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
    persist(
        (set, get) => ({
            theme: "light", // Default theme
            isInitialized: false,
            
            initializeTheme: () => {
                const currentTheme = get().theme;
                console.log("Initializing theme with:", currentTheme);
                
                // Apply theme to HTML element immediately
                document.documentElement.setAttribute('data-theme', currentTheme);
                
                set({ isInitialized: true });
            },
            
            setTheme: (newTheme) => {
                console.log("Setting theme to:", newTheme);
                
                // Apply theme to HTML element immediately
                document.documentElement.setAttribute('data-theme', newTheme);
                
                // Also apply to body for extra compatibility
                document.body.setAttribute('data-theme', newTheme);
                
                set({ theme: newTheme });
                console.log("Theme set successfully:", newTheme);
            },
        }),
        {
            name: "streamify-theme", // localStorage key
            partialize: (state) => ({ theme: state.theme }), // Only persist the theme
        }
    )
);

export default useThemeStore;