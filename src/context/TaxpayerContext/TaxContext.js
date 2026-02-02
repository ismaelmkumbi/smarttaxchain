// src/context/TaxContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'src/utils/axios';

// Create contexts
const TaxpayerContext = createContext();
const TaxAssessmentContext = createContext();

// Combined provider component
export const TaxContextProvider = ({ children }) => {
  // Taxpayer state and methods
  const [taxpayers, setTaxpayers] = useState([]);
  const [taxpayerLoading, setTaxpayerLoading] = useState(true);
  const [taxpayerError, setTaxpayerError] = useState(null);

  // Assessment state and methods
  const [assessments, setAssessments] = useState([]);
  const [assessmentLoading, setAssessmentLoading] = useState(true);
  const [assessmentError, setAssessmentError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taxpayersRes, assessmentsRes] = await Promise.all([
          axios.get('/api/tax/taxpayers'),
          axios.get('/api/tax/assessments'),
        ]);
        setTaxpayers(taxpayersRes.data);
        setAssessments(assessmentsRes.data);
      } catch (error) {
        setTaxpayerError(error);
        setAssessmentError(error);
      } finally {
        setTaxpayerLoading(false);
        setAssessmentLoading(false);
      }
    };

    fetchData();
  }, []);

  // Taxpayer methods
  const searchTaxpayers = async (searchTerm) => {
    try {
      const response = await axios.get(`/api/tax/taxpayers/search?q=${searchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching taxpayers:', error);
      return [];
    }
  };

  // Assessment methods
  const generateAssessment = async (taxpayerId) => {
    try {
      setAssessmentLoading(true);
      const response = await axios.post('/api/tax/assessments/generate', { taxpayerId });
      const newAssessment = response.data;
      setAssessments((prev) => [...prev, newAssessment]);
      return newAssessment;
    } catch (error) {
      console.error('Error generating assessment:', error);
      throw error;
    } finally {
      setAssessmentLoading(false);
    }
  };

  const generatePaymentNotice = async (assessmentId) => {
    try {
      setAssessmentLoading(true);
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
      setAssessmentLoading(false);
    }
  };

  return (
    <TaxpayerContext.Provider
      value={{
        taxpayers,
        loading: taxpayerLoading,
        error: taxpayerError,
        searchTaxpayers,
      }}
    >
      <TaxAssessmentContext.Provider
        value={{
          assessments,
          loading: assessmentLoading,
          error: assessmentError,
          generateAssessment,
          generatePaymentNotice,
        }}
      >
        {children}
      </TaxAssessmentContext.Provider>
    </TaxpayerContext.Provider>
  );
};

// Custom hooks
export const useTaxpayers = () => {
  const context = useContext(TaxpayerContext);
  if (!context) {
    throw new Error('useTaxpayers must be used within a TaxContextProvider');
  }
  return context;
};

export const useTaxAssessments = () => {
  const context = useContext(TaxAssessmentContext);
  if (!context) {
    throw new Error('useTaxAssessments must be used within a TaxContextProvider');
  }
  return context;
};

export default TaxContextProvider;
