import React, { createContext, useContext, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setMobileMenuOpen, setCityFilter, setTheme, Theme } from '../store/slices/uiSlice';

interface UIContextType {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  currentCity: string;
  changeCity: (city: string) => void;
  availableCities: string[];
  theme: Theme;
  toggleTheme: () => void;
  setThemeMode: (theme: Theme) => void;
  isOnline: boolean;
  showNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const UIContext = createContext<UIContextType>({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => {},
  closeMobileMenu: () => {},
  currentCity: '',
  changeCity: () => {},
  availableCities: [],
  theme: 'light',
  toggleTheme: () => {},
  setThemeMode: () => {},
  isOnline: true,
  showNotification: () => {},
});

export const useUI = () => useContext(UIContext);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { mobileMenuOpen, city, theme, availableCities } = useAppSelector(state => state.ui);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false,
  });

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Mobile menu functions
  const toggleMobileMenu = () => {
    dispatch(setMobileMenuOpen(!mobileMenuOpen));
  };

  const closeMobileMenu = () => {
    dispatch(setMobileMenuOpen(false));
  };

  // City filter functions
  const changeCity = (cityName: string) => {
    dispatch(setCityFilter(cityName));
  };

  // Theme functions
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  };

  const setThemeMode = (themeMode: Theme) => {
    dispatch(setTheme(themeMode));
  };

  // Notification function
  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setNotification({
      message,
      type,
      visible: true,
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const value = {
    isMobileMenuOpen: mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    currentCity: city,
    changeCity,
    availableCities,
    theme,
    toggleTheme,
    setThemeMode,
    isOnline,
    showNotification,
  };

  return (
    <UIContext.Provider value={value}>
      {children}

      {/* Notification Toast */}
      {notification.visible && (
        <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 mb-4 px-4 py-2 rounded-md shadow-lg z-50
          ${notification.type === 'success' ? 'bg-green-500' : 
            notification.type === 'error' ? 'bg-red-500' : 
            notification.type === 'warning' ? 'bg-yellow-500' : 
            'bg-blue-500'} text-white`}>
          {notification.message}
        </div>
      )}
    </UIContext.Provider>
  );
};