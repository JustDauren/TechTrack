import React, { useState } from 'react';
import { Bell, ChevronDown, Map, Menu, ChevronRight, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCityFilter } from '../../store/slices/uiSlice';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const dispatch = useAppDispatch();
  const { city: currentCity } = useAppSelector(state => state.ui);
  const cities = useAppSelector(state => state.ui.availableCities);

  const [isAddingCity, setIsAddingCity] = useState(false);
  const [newCity, setNewCity] = useState('');

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCityFilter(e.target.value));
  };

  const handleAddCity = () => {
    if (newCity.trim()) {
      // In a real app, this would be dispatched to add the city to the backend
      // For now we just set it as the current city
      dispatch(setCityFilter(newCity.trim()));
      setNewCity('');
      setIsAddingCity(false);
    }
  };

  // Standard header for inner pages
  return (
    <div className="bg-white p-3 shadow-sm mb-3 flex justify-between items-center">
      <div className="flex items-center">
        <Map className="text-primary-600 mr-2" size={18} />
        {!isAddingCity ? (
          <div className="flex items-center">
            <select
              value={currentCity}
              onChange={handleCityChange}
              className="font-medium text-base bg-transparent border-none focus:outline-none"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <ChevronDown size={16} className="text-gray-500 ml-1" />
          </div>
        ) : (
          <div className="flex items-center">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="border-b border-primary-500 bg-transparent p-1 w-32 text-base focus:outline-none"
              placeholder="Новый город"
              autoFocus
            />
            <button
              className="ml-2 text-green-600"
              onClick={handleAddCity}
            >
              <ChevronRight size={16} />
            </button>
            <button
              className="ml-1 text-red-600"
              onClick={() => setIsAddingCity(false)}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <button
          className="mr-3 text-primary-600"
          onClick={() => setIsAddingCity(true)}
          title="Добавить город"
        >
          <Map size={20} />
        </button>
        <Bell size={20} className="text-gray-500 mr-3" cursor="pointer" />
        <div
          className="w-6 h-5 flex flex-col justify-center items-center cursor-pointer"
          onClick={toggleSidebar}
        >
          <Menu size={20} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default Header;