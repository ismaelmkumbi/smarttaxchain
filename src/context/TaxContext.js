import React, { createContext, useContext, useEffect, useState } from 'react';

export const TaxContext = createContext(undefined);

export const TaxProvider = ({ children }) => {
  const [assessments, setAssessments] = useState([]);
  const [taxpayers, setTaxpayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate dummy data on initial load
  useEffect(() => {
    const generateDummyData = () => {
      try {
        // Dummy taxpayers data
        const dummyTaxpayers = [
          {
            id: '1',
            name: 'John Smith',
            tin: '145288-TZ',
            type: 'Individual',
            sector: 'Agriculture',
            region: 'Arusha',
            email: 'john.smith@example.com',
            phone: '+255 789 456 123',
            address: '123 Farm Road, Arusha',
            complianceRating: 'Medium Risk',
            lastAuditDate: '2023-11-15',
          },
          {
            id: '2',
            name: 'Jane Co. Ltd',
            tin: '738820-TZ',
            type: 'Business',
            sector: 'Retail',
            region: 'Dar es Salaam',
            email: 'accounts@janeco.tz',
            phone: '+255 712 345 678',
            address: '456 Business Street, Dar es Salaam',
            complianceRating: 'Low Risk',
            lastAuditDate: '2024-01-20',
          },
          {
            id: '3',
            name: 'Green Energy NGO',
            tin: '992165-TZ',
            type: 'NGO',
            sector: 'Energy',
            region: 'Mwanza',
            email: 'finance@greenenergy.tz',
            phone: '+255 765 432 100',
            address: '789 Solar Avenue, Mwanza',
            complianceRating: 'High Risk',
            lastAuditDate: '2022-09-10',
          },
        ];

        // Dummy assessments data
        const dummyAssessments = [
          {
            id: 'TAX-2023-001',
            taxpayerId: '1',
            taxpayerName: 'John Smith',
            tin: '145288-TZ',
            taxpayerType: 'Individual',
            sector: 'Agriculture',
            region: 'Arusha',
            assessmentPeriod: 'Q1 2024',
            issueDate: '2024-03-15',
            dueDate: '2024-04-15',
            status: 'Pending',
            taxOffice: 'TRA Arusha',
            assignedOfficer: 'Officer Juma',
            lastAuditDate: '2023-11-15',
            complianceRating: 'Medium Risk',
            taxItems: [
              {
                taxType: 'Income Tax',
                period: 'Q1 2024',
                taxableAmount: 4500000,
                rate: 15,
                amountDue: 675000,
              },
              {
                taxType: 'VAT',
                period: 'Q1 2024',
                taxableAmount: 3200000,
                rate: 18,
                amountDue: 576000,
              },
            ],
            subtotal: 1251000,
            penalties: 50000,
            interest: 25000,
            totalDue: 1326000,
          },
          {
            id: 'TAX-2023-002',
            taxpayerId: '2',
            taxpayerName: 'Jane Co. Ltd',
            tin: '738820-TZ',
            taxpayerType: 'Business',
            sector: 'Retail',
            region: 'Dar es Salaam',
            assessmentPeriod: 'Jan 2024',
            issueDate: '2024-02-28',
            dueDate: '2024-03-28',
            status: 'Paid',
            taxOffice: 'TRA Dar es Salaam',
            assignedOfficer: 'Officer Fatma',
            lastAuditDate: '2024-01-20',
            complianceRating: 'Low Risk',
            taxItems: [
              {
                taxType: 'Corporate Tax',
                period: 'Jan 2024',
                taxableAmount: 12000000,
                rate: 30,
                amountDue: 3600000,
              },
              {
                taxType: 'VAT',
                period: 'Jan 2024',
                taxableAmount: 8500000,
                rate: 18,
                amountDue: 1530000,
              },
            ],
            subtotal: 5130000,
            penalties: 0,
            interest: 0,
            totalDue: 5130000,
          },
          {
            id: 'TAX-2023-003',
            taxpayerId: '3',
            taxpayerName: 'Green Energy NGO',
            tin: '992165-TZ',
            taxpayerType: 'NGO',
            sector: 'Energy',
            region: 'Mwanza',
            assessmentPeriod: 'FY 2023',
            issueDate: '2024-04-01',
            dueDate: '2024-05-01',
            status: 'In Progress',
            taxOffice: 'TRA Mwanza',
            assignedOfficer: 'Officer Rajab',
            lastAuditDate: '2022-09-10',
            complianceRating: 'High Risk',
            taxItems: [
              {
                taxType: 'Withholding Tax',
                period: 'FY 2023',
                taxableAmount: 7500000,
                rate: 10,
                amountDue: 750000,
              },
            ],
            subtotal: 750000,
            penalties: 100000,
            interest: 50000,
            totalDue: 900000,
          },
        ];

        setTaxpayers(dummyTaxpayers);
        setAssessments(dummyAssessments);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    // Simulate API call delay
    setTimeout(generateDummyData, 1000);
  }, []);

  // Function to get assessment by ID
  const getAssessmentById = (id) => {
    return assessments.find((assessment) => assessment.id === id);
  };

  // Function to get taxpayer by ID
  const getTaxpayerById = (id) => {
    return taxpayers.find((taxpayer) => taxpayer.id === id);
  };

  // Function to add new assessment
  const addAssessment = (newAssessment) => {
    setAssessments((prev) => [...prev, newAssessment]);
  };

  // Function to update assessment
  const updateAssessment = (updatedAssessment) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === updatedAssessment.id ? updatedAssessment : assessment,
      ),
    );
  };

  // Function to delete assessment
  const deleteAssessment = (id) => {
    setAssessments((prev) => prev.filter((assessment) => assessment.id !== id));
  };

  // Function to mark assessment as paid
  const markAsPaid = (id) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === id ? { ...assessment, status: 'Paid' } : assessment,
      ),
    );
  };

  return (
    <TaxContext.Provider
      value={{
        assessments,
        taxpayers,
        loading,
        error,
        getAssessmentById,
        getTaxpayerById,
        addAssessment,
        updateAssessment,
        deleteAssessment,
        markAsPaid,
      }}
    >
      {children}
    </TaxContext.Provider>
  );
};

// Custom hook for easy context consumption
export const useTaxContext = () => {
  const context = useContext(TaxContext);
  if (context === undefined) {
    throw new Error('useTaxContext must be used within a TaxProvider');
  }
  return context;
};
