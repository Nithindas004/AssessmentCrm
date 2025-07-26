// src/components/leads/LeadsTable.tsx
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLead } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal } from 'lucide-react';

interface LeadsTableProps {
  leads: any[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (lead: any) => void;
}

const LeadsTable = ({ leads, isLoading, error, onEdit }: LeadsTableProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (leadId: string) => deleteLead(leadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (error) => {
      console.error('Failed to delete lead:', error);
    },
  });

  const handleDeleteClick = (leadId: string) => {
    setLeadToDelete(leadId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (leadToDelete) {
      deleteMutation.mutate(leadToDelete);
    }
    setIsDeleteDialogOpen(false);
    setLeadToDelete(null);
  };

  if (isLoading) return <div className="p-4 text-center">Loading leads...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company / Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Admin Notes</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="font-medium">{lead.fullName}</TableCell>
                <TableCell>
                  <div>{lead.email}</div>
                  <div className="text-sm text-muted-foreground">{lead.phone}</div>
                    </TableCell>
                    <TableCell>
                <div>{lead.company || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Source: {lead.source || 'N/A'}</div>
              </TableCell>
                <TableCell><Badge>{lead.status}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{lead.notes || 'No notes'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(lead)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(lead._id)} className="text-red-500">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={5} className="h-24 text-center">No leads found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LeadsTable;