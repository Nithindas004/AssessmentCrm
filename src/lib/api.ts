// src/lib/api.ts

// Define the shape of the lead data for forms
export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
    source?: string;
    notes?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Won' | 'Lost';
}

// Define the shape of the response from the GET /api/leads endpoint
export interface LeadsResponse {
  leads: any[]; // You can create a more specific ILead type later
  totalPages: number;
  currentPage: number;
}

/**
 * Fetches a list of leads from the API.
 * @param page - The page number for pagination.
 * @param limit - The number of items per page.
 * @param status - Filter by lead status.
 * @param query - Search query for name, email, or phone.
 * @returns A promise that resolves to the leads response.
 */
export const getLeads = async ({ page = 1, limit = 10, status = '', query = '' }): Promise<LeadsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) {
    params.append('status', status);
  }

  if (query) {
    params.append('query', query);
  }

  const response = await fetch(`/api/leads?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }

  return response.json();
};

/**
 * Creates a new lead.
 * @param leadData - The data for the new lead.
 * @returns A promise that resolves to the newly created lead.
 */
export const createLead = async (leadData: LeadFormData) => {
    const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
    });

    if (!response.ok) {
        throw new Error('Failed to create lead');
    }

    return response.json();
};

/**
 * Updates an existing lead.
 * @param id - The ID of the lead to update.
 * @param leadData - The data to update.
 * @returns A promise that resolves to the updated lead.
 */
export const updateLead = async (id: string, leadData: Partial<LeadFormData>) => {
  const response = await fetch(`/api/leads/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  });

  if (!response.ok) {
    throw new Error('Failed to update lead');
  }

  return response.json();
};

/**
 * Deletes a lead by its ID.
 * @param leadId - The ID of the lead to delete.
 */
export const deleteLead = async (leadId: string) => {
  const response = await fetch(`/api/leads/${leadId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete lead');
  }

  return response.json();
};