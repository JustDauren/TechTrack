import React, { useState } from 'react';
import { Zap, X, Plus, FileText, AlertTriangle, Package } from 'lucide-react';

interface FabMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  items: FabMenuItem[];
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Backdrop for when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-filter backdrop-blur-sm z-20"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Floating action button and menu */}
      <div className="fixed bottom-16 inset-x-0 flex justify-center items-center z-20">
        <div>
          <button
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
              isOpen ? 'bg-red-500' : 'bg-primary-600'
            } transition-all duration-300`}
            onClick={toggleMenu}
          >
            {isOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Zap size={24} className="text-white" />
            )}
          </button>

          {isOpen && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48 space-y-2">
              {items.map((item, index) => (
                <button
                  key={index}
                  className="w-full bg-white rounded-lg shadow-md p-3 flex items-center justify-between"
                  onClick={() => {
                    setIsOpen(false);
                    item.onClick();
                  }}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.icon}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Predefined icons for common actions
export const FabIcons = {
  CreateReport: <FileText size={18} className="text-primary-600" />,
  ReportIssue: <AlertTriangle size={18} className="text-primary-600" />,
  AddTask: <Plus size={18} className="text-primary-600" />,
  Parts: <Package size={18} className="text-primary-600" />,
};

export default FloatingActionButton;