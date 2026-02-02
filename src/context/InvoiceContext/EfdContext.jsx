import React, { createContext, useContext, useEffect, useState } from 'react';

export const InvoiceContext = createContext(undefined);

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Sample data for demonstration
    const sampleInvoices = [
      {
        id: 'TX-1',
        transactionHash: '0xabc...123',
        blockNumber: 1428,
        timestamp: '2023-10-01T12:34:56Z',
        billFrom: 'TanzBiz Ltd',
        billTo: 'TRA Treasury',
        amount: 1500,
        taxAmount: 270,
        vatRate: 18,
        status: 'CONFIRMED',
        checksum: 'YWIjMTUwMDI3MFRSQQ=='.slice(0, 16),
        originalData: null,
      },
    ];
    setInvoices(sampleInvoices);
    setLoading(false);
  }, []);

  const deleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
  };

  const addBlock = (newInvoice) => {
    const addedInvoice = { ...newInvoice, id: `TX-${Date.now()}` };
    setInvoices((prev) => [...prev, addedInvoice]);
  };

  const updateInvoice = (updatedInvoice) => {
    setInvoices((prev) =>
      prev.map((invoice) => (invoice.id === updatedInvoice.id ? updatedInvoice : invoice)),
    );
  };

  return (
    <InvoiceContext.Provider
      value={{ invoices, loading, error, deleteInvoice, addBlock, updateInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
