// src/components/dashboard/SalespersonDashboard.tsx
'use client';

import { useState } from 'react';
import { getLeads } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PlusCircle } from 'lucide-react';
import LeadsTable from '../leads/LeadsTable';
import { LeadForm } from '../leads/LeadForm';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export default function SalespersonDashboard() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['leads', page, searchQuery, statusFilter],
      queryFn: () => getLeads({ page, query: searchQuery, status: statusFilter }),
    placeholderData: keepPreviousData,
    // keepPreviousData: true,
  });

  const handleEdit = (lead: any) => {
    setLeadToEdit(lead);
    setIsFormOpen(true);
  };

  const openNewLeadForm = () => {
    setLeadToEdit(null);
    setIsFormOpen(true);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Leads</h1>
          <p className="text-muted-foreground">Manage your customer leads.</p>
        </div>
        <Button onClick={openNewLeadForm}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Lead
        </Button>
      </div>

      <LeadForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} leadToEdit={leadToEdit} />

      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select
  value={statusFilter || "all"} // The select value can't be empty, so default to "all"
  onValueChange={(value) => {
    // If the user selects "all", clear the filter by setting state to ""
    setStatusFilter(value === "all" ? "" : value);
  }}
>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Filter by status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Statuses</SelectItem>
    <SelectItem value="New">New</SelectItem>
    <SelectItem value="Contacted">Contacted</SelectItem>
    <SelectItem value="In Progress">In Progress</SelectItem>
    <SelectItem value="Won">Won</SelectItem>
    <SelectItem value="Lost">Lost</SelectItem>
  </SelectContent>
</Select>
      </div>

      <div className="rounded-md border">
        <LeadsTable
          leads={data?.leads || []}
          isLoading={isLoading}
          error={error as Error | null}
          onEdit={handleEdit}
        />
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={data?.currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
            <PaginationItem className="text-sm font-medium">
              Page {data?.currentPage} of {data?.totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => (data?.currentPage === data?.totalPages ? prev : prev + 1))}
                className={data?.currentPage === data?.totalPages ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}