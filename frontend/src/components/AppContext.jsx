import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const toggleCreateForm = () => setShowCreateForm((prev) => !prev);

 

  return (
    <AppContext.Provider value={{ showCreateForm,setShowCreateForm, toggleCreateForm, searchTerm, setSearchTerm  }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
