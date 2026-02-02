import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'src/utils/axios';

// Create contexts for taxpayers and tax assessments
export const TaxpayerContext = createContext(undefined);
export const TaxAssessmentContext = createContext(undefined);

// Taxpayer Provider
export const TaxpayerProvider = ({ children }) => {
  const [taxpayers, setTaxpayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial taxpayer data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/tax/taxpayers');
        setTaxpayers(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search taxpayers by name or TIN
  const searchTaxpayers = async (searchTerm) => {
    try {
      const response = await axios.get(`/api/tax/taxpayers/search?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching taxpayers:', error);
      return [];
    }
  };

  return (
    <TaxpayerContext.Provider value={{ taxpayers, loading, error, searchTaxpayers }}>
      {children}
    </TaxpayerContext.Provider>
  );
};

// Tax Assessment Provider
export const TaxAssessmentProvider = ({ children }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial assessment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/tax/assessments');
        setAssessments(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate a new tax assessment for a taxpayer
  const generateAssessment = async (taxpayerId) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/tax/assessments/generate', { taxpayerId });
      const newAssessment = response.data;

      setAssessments((prev) => [...prev, newAssessment]);
      return newAssessment;
    } catch (error) {
      console.error('Error generating assessment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Generate a payment notice for an assessment
  const generatePaymentNotice = async (assessmentId) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/tax/assessments/generate-payment-notice', {
        assessmentId,
      });
      const updatedAssessment = response.data;

      setAssessments((prev) =>
        prev.map((a) => (a.id === updatedAssessment.id ? updatedAssessment : a)),
      );
      return updatedAssessment;
    } catch (error) {
      console.error('Error generating payment notice:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update assessment status (e.g., when dispute is resolved)
  const updateAssessmentStatus = async (assessmentId, status) => {
    try {
      setLoading(true);
      const response = await axios.put('/api/tax/assessments/update-status', {
        assessmentId,
        status,
      });
      const updatedAssessment = response.data;

      setAssessments((prev) =>
        prev.map((a) => (a.id === updatedAssessment.id ? updatedAssessment : a)),
      );
      return updatedAssessment;
    } catch (error) {
      console.error('Error updating assessment status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get assessments for a specific taxpayer
  const getAssessmentsByTaxpayer = async (taxpayerId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tax/assessments?taxpayerId=${taxpayerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching taxpayer assessments:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaxAssessmentContext.Provider
      value={{
        assessments,
        loading,
        error,
        generateAssessment,
        generatePaymentNotice,
        updateAssessmentStatus,
        getAssessmentsByTaxpayer,
      }}
    >
      {children}
    </TaxAssessmentContext.Provider>
  );
};

// Custom hooks for easy context access
export const useTaxpayers = () => {
  const context = useContext(TaxpayerContext);
  if (context === undefined) {
    throw new Error('useTaxpayers must be used within a TaxpayerProvider');
  }
  return context;
};

export const useTaxAssessments = () => {
  const context = useContext(TaxAssessmentContext);
  if (context === undefined) {
    throw new Error('useTaxAssessments must be used within a TaxAssessmentProvider');
  }
  return context;
};
