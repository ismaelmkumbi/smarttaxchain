import React, { createContext, useContext, useEffect, useState } from 'react';
import api from 'src/services/api';

export const AssessmentContext = createContext(undefined);

export const AssessmentProvider = ({ children }) => {
  const [assessments, setAssessments] = useState([]);
  const [taxpayers, setTaxpayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentsRes, taxpayersRes] = await Promise.all([
          api.get('/api/assessments'),
          api.get('/api/taxpayers'),
        ]);
        // api interceptor already returns response.data
        setAssessments(assessmentsRes?.data || assessmentsRes || []);
        setTaxpayers(taxpayersRes?.data?.taxpayers || taxpayersRes?.taxpayers || []);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Blockchain-aware assessment operations
  const addAssessment = async (newAssessment) => {
    try {
      // For real implementation, add blockchain tx validation here
      const response = await api.post('/api/assessments', {
        ...newAssessment,
        blockchainStatus: 'pending',
      });

      // api interceptor already returns response.data
      const newData = response?.data || response;
      setAssessments((prev) => [
        ...prev.filter((a) => a.id !== newAssessment.id), // Remove temporary ID
        newData,
      ]);
      return newData;
    } catch (error) {
      console.error('Error adding assessment:', error);
      throw error;
    }
  };

  const updateAssessment = async (id, updates) => {
    try {
      const response = await api.patch(`/api/assessments/${id}`, {
        ...updates,
        lastUpdated: new Date().toISOString(),
      });
      // api interceptor already returns response.data
      const updatedData = response?.data || response;
      setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updatedData } : a)));
      return updatedData;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  };

  const deleteAssessment = async (id) => {
    try {
      await api.delete(`/api/assessments/${id}`);
      setAssessments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  };

  // Taxpayer management (read-only for this context)
  const searchTaxpayers = async (searchTerm) => {
    try {
      const response = await api.get(`/api/taxpayers?search=${searchTerm}`);
      // api interceptor already returns response.data
      return response?.data?.taxpayers || response?.taxpayers || [];
    } catch (error) {
      console.error('Error searching taxpayers:', error);
      return [];
    }
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessments,
        taxpayers,
        loading,
        error,
        addAssessment,
        updateAssessment,
        deleteAssessment,
        searchTaxpayers,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

// Custom hook for easy context consumption
export const useAssessments = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessments must be used within an AssessmentProvider');
  }
  return context;
};
