// src/context/AssessmentContext.js
import React, { createContext, useContext, useState } from 'react';

export const AssessmentContext = createContext();

export const AssessmentProvider = ({ children }) => {
  const [assessments, setAssessments] = useState([]);

  const generateBlockchainHash = () => {
    return `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`;
  };

  const addAssessment = (assessment) => {
    const newAssessment = {
      ...assessment,
      timestamp: new Date().toISOString(),
      blockchainHash: assessment.blockchainHash || generateBlockchainHash(),
      history: [
        ...(assessment.history || []),
        {
          timestamp: new Date().toISOString(),
          action: 'Created',
          details: 'Initial assessment created',
        },
      ],
    };
    setAssessments((prev) => [...prev, newAssessment]);
    return newAssessment;
  };

  const updateAssessment = (updatedAssessment) => {
    setAssessments((prev) =>
      prev.map((a) => {
        if (a.assessmentId === updatedAssessment.assessmentId) {
          return {
            ...updatedAssessment,
            history: [
              ...a.history,
              {
                timestamp: new Date().toISOString(),
                action: 'Modified',
                details: 'Assessment updated',
              },
            ],
          };
        }
        return a;
      }),
    );
  };

  const deleteAssessment = (assessmentId) => {
    setAssessments((prev) => prev.filter((a) => a.assessmentId !== assessmentId));
  };

  const getAssessmentById = (assessmentId) => {
    return assessments.find((a) => a.assessmentId === assessmentId);
  };

  const addAdjustment = (assessmentId, adjustment) => {
    setAssessments((prev) =>
      prev.map((a) => {
        if (a.assessmentId === assessmentId) {
          return {
            ...a,
            adjustments: [...a.adjustments, adjustment],
            history: [
              ...a.history,
              {
                timestamp: new Date().toISOString(),
                action: 'Adjustment Added',
                details: `Adjustment: ${adjustment.reason} (Amount: ${adjustment.amount})`,
              },
            ],
          };
        }
        return a;
      }),
    );
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessments,
        addAssessment,
        updateAssessment,
        deleteAssessment,
        getAssessmentById,
        addAdjustment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessmentContext = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessmentContext must be used within an AssessmentProvider');
  }
  return context;
};
