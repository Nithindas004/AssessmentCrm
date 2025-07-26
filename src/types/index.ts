// src/types/index.ts

export interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  source?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Won' | 'Lost';
  notes?: string;
  createdBy: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}