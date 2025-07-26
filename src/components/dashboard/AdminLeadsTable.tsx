// src/components/dashboard/AdminLeadsTable.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, updateLead } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const AdminLeadsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [noteContent, setNoteContent] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['leads', 1, searchQuery], // Admins see all leads
    queryFn: () => getLeads({ page: 1, query: searchQuery, limit: 100 }), // Fetch more for demo
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ leadId, notes }: { leadId: string; notes: string }) => updateLead(leadId, { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setSelectedLead(null); // Close the dialog
    },
    onError: (error) => {
      console.error('Failed to update note:', error);
      // You can add a user-facing error message here
    },
  });

  const handleOpenNoteDialog = (lead: any) => {
    setSelectedLead(lead);
    setNoteContent(lead.notes || '');
  };

  const handleSaveNote = () => {
    if (selectedLead) {
      updateNoteMutation.mutate({ leadId: selectedLead._id, notes: noteContent });
    }
  };

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search all leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
                          <TableHead>Lead Name</TableHead>
                          <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Salesperson</TableHead>
              <TableHead className="text-right">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell></TableRow>
            ) : (
              data?.leads.map((lead) => (
                <TableRow key={lead._id}>
                      <TableCell>{lead.fullName}</TableCell>
                      <TableCell>{lead.company || 'N/A'}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{lead.createdBy?.fullName || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpenNoteDialog(lead)}>
                      View / Edit Note
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Note Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(isOpen) => !isOpen && setSelectedLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Note for {selectedLead?.fullName}</DialogTitle>
            <DialogDescription>
              This note is only visible to the salesperson who created the lead.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add a private note..."
            rows={5}
          />
          <DialogFooter>
            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
            <Button onClick={handleSaveNote} disabled={updateNoteMutation.isPending}>
              {updateNoteMutation.isPending ? 'Saving...' : 'Save Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminLeadsTable;