// src/services/taxpayerService.js
import api from './api';

const handleApiResponse = (response) => {
  if (!response) {
    throw new Error('No response from server');
  }

  if (response.success === false) {
    const error = new Error(response.error?.message || 'Request failed');
    error.code = response.error?.code;
    error.details = response.error?.details;
    throw error;
  }

  return response.data ?? response;
};

const taxpayerService = {
  // Fetch all taxpayers
  getAll: async (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await api.get(`/api/taxpayers${query}`);
    const data = handleApiResponse(response);
    return data.taxpayers || data;
  },

  // Get single taxpayer by ID
  getById: async (id) => {
    const response = await api.get(`/api/taxpayers/${id}`);
    const data = handleApiResponse(response);
    return data.taxpayer || data;
  },

  // Create new taxpayer
  create: async (data) => {
    const {
        name,
        tin,
        vrn,
        regDate,
        type,
        category,
        address,
        email,
        phone,
        signatories,
      nin,
    } = data;

    const payload = {
      name,
      tin,
      vrn,
      type,
      registrationType: type?.toLowerCase() === 'individual' ? 'nin' : 'tin',
      registrationAddress: address,
      businessCategory: category,
      registrationDate: regDate,
      contactEmail: email,
      phoneNumber: phone,
      authorizedSignatories: signatories?.filter(Boolean) ?? [],
      nin: nin || null,
    };

    const response = await api.post('/api/taxpayers/register', payload);
    return handleApiResponse(response);
  },

  // Update existing taxpayer (audited edits)
  update: async (id, data) => {
    // Validate ID
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) {
      throw new Error('Invalid taxpayer ID format');
    }

    // Build updates object with API field names
    const updates = {};
    
    // Only include fields that have changed or are provided
    if (data.email !== undefined) updates.ContactEmail = data.email;
    if (data.phone !== undefined) updates.PhoneNumber = data.phone;
    if (data.address !== undefined) updates.RegistrationAddress = data.address;
    if (data.category !== undefined) updates.BusinessCategory = data.category;
    if (data.name !== undefined) updates.Name = data.name;
    if (data.type !== undefined) updates.Type = data.type;
    if (data.regDate !== undefined) updates.RegisteredDate = data.regDate;
    if (data.signatories !== undefined) updates.AuthorizedSignatories = data.signatories?.filter(Boolean) ?? [];
    if (data.status !== undefined) updates.Status = data.status;

    // Ensure ID is a string and properly encoded
    const taxpayerId = String(id).trim();
    if (!taxpayerId) {
      throw new Error('Taxpayer ID cannot be empty');
    }

    // API expects { "updates": { ... } } format
    const response = await api.put(`/api/taxpayers/${encodeURIComponent(taxpayerId)}`, { updates });
    const result = handleApiResponse(response);
    
    // Return both taxpayer and audit info
    return {
      taxpayer: result.taxpayer || result,
      audit: result.audit || null,
    };
  },

  // Delete taxpayer
  delete: async (id) => {
    const response = await api.delete(`/api/taxpayers/${id}`);
    return handleApiResponse(response);
  },

  // Batch delete taxpayers
  deleteMultiple: async (ids) => {
    const response = await api.post('/api/taxpayers/batch-delete', { ids });
    return handleApiResponse(response);
  },
};

export default taxpayerService;
