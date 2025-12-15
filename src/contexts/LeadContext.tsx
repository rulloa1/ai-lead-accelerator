import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead, LeadStatus, Note, ContactEvent } from '@/types/lead';
import { mockLeads } from '@/data/mockData';

interface LeadContextType {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  addNote: (leadId: string, content: string) => void;
  addContactEvent: (leadId: string, event: Omit<ContactEvent, 'id' | 'createdAt'>) => void;
  getLeadById: (id: string) => Lead | undefined;
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const addLead = (lead: Lead) => {
    setLeads((prev) => [...prev, lead]);
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status, updatedAt: new Date() } : lead
      )
    );
    if (selectedLead?.id === id) {
      setSelectedLead((prev) => prev ? { ...prev, status, updatedAt: new Date() } : null);
    }
  };

  const addNote = (leadId: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      createdAt: new Date(),
    };
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? { ...lead, notes: [...lead.notes, newNote], updatedAt: new Date() }
          : lead
      )
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) =>
        prev ? { ...prev, notes: [...prev.notes, newNote], updatedAt: new Date() } : null
      );
    }
  };

  const addContactEvent = (leadId: string, event: Omit<ContactEvent, 'id' | 'createdAt'>) => {
    const newEvent: ContactEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? { ...lead, contactHistory: [...lead.contactHistory, newEvent], updatedAt: new Date() }
          : lead
      )
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) =>
        prev ? { ...prev, contactHistory: [...prev.contactHistory, newEvent], updatedAt: new Date() } : null
      );
    }
  };

  const getLeadById = (id: string) => leads.find((lead) => lead.id === id);

  return (
    <LeadContext.Provider
      value={{
        leads,
        addLead,
        updateLeadStatus,
        addNote,
        addContactEvent,
        getLeadById,
        selectedLead,
        setSelectedLead,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}
