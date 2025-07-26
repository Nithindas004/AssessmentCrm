// src/components/leads/LeadForm.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLead, updateLead, LeadFormData } from '@/lib/api'; // Make sure to export updateLead from your api file
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Lead } from "@/types";

const leadSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().min(10, 'Invalid phone number.'),
  company: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(["New", "Contacted", "In Progress", "Won", "Lost"]),
});

// 1. UPDATE THE PROPS INTERFACE
interface LeadFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  leadToEdit?: Lead | null; // <-- ADD THIS PROP
}

export function LeadForm({ isOpen, setIsOpen, leadToEdit }: LeadFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      source: '',
      status: 'New',
    },
  });

  // 2. ADD USEEFFECT TO POPULATE THE FORM FOR EDITING
  useEffect(() => {
    if (leadToEdit) {
      // If we are editing, populate the form with the lead's data
      form.reset(leadToEdit);
    } else {
      // If we are adding a new lead, ensure the form is cleared
      form.reset({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        source: '',
        status: 'New',
      });
    }
  }, [leadToEdit, form]);

  const mutation = useMutation({
    mutationFn: (leadData: LeadFormData) => {
      if (leadToEdit) {
        return updateLead(leadToEdit._id, leadData); // You need to create this updateLead API function
      }
      return createLead(leadData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Failed to save lead:", error);
    },
  });

  function onSubmit(values: z.infer<typeof leadSchema>) {
    mutation.mutate(values);
  }

  const isEditing = !!leadToEdit;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this lead.' : 'Enter the details for the new lead.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form Fields remain the same */}
            <FormField name="fullName" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="phone" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
              <FormField name="company" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Company (Optional)</FormLabel><FormControl><Input placeholder="Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="source" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Source (Optional)</FormLabel><FormControl><Input placeholder="Referral" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField name="status" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Won">Won</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}