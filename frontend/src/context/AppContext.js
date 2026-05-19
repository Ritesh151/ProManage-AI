import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { projectAPI } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const initialState = {
  projects: [],
  loading: false,
  pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  sidebarOpen: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchProjects = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await projectAPI.getAll(params);
      dispatch({ type: 'SET_PROJECTS', payload: res.data.data });
      if (res.data.pagination) {
        dispatch({ type: 'SET_PAGINATION', payload: res.data.pagination });
      }
    } catch {
      dispatch({ type: 'SET_PROJECTS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const createProject = useCallback(async (data) => {
    const res = await projectAPI.create(data);
    return res.data;
  }, []);

  const updateProject = useCallback(async (id, data) => {
    const res = await projectAPI.update(id, data);
    return res.data;
  }, []);

  const deleteProject = useCallback(async (id) => {
    await projectAPI.delete(id);
  }, []);

  const value = {
    ...state,
    setSidebarOpen: (open) => dispatch({ type: 'SET_SIDEBAR', payload: open }),
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
