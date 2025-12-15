import { useState } from 'react';
import { Lead, LeadStatus } from '@/types/lead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QualityScoreBadge } from './QualityScoreBadge';
import { StatusBadge } from './StatusBadge';
import { useLeads } from '@/contexts/LeadContext';
import { 
  X, 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  Mail, 
  Phone,
  Clock,
  MessageSquare,
  Plus,
  Send,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface LeadDetailPanelProps {
  lead: Lead;
  onClose: () => void;
}

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'interested', label: 'Interested' },
  { value: 'not-interested', label: 'Not Interested' },
  { value: 'closed', label: 'Closed' },
];

const contactTypes = [
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'other', label: 'Other' },
];

export function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  const { updateLeadStatus, addNote, addContactEvent } = useLeads();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactType, setContactType] = useState<'email' | 'call' | 'meeting' | 'linkedin' | 'other'>('email');
  const [contactDescription, setContactDescription] = useState('');
  const [contactOutcome, setContactOutcome] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(lead.id, newNote);
      setNewNote('');
    }
  };

  const handleAddContactEvent = () => {
    if (contactDescription.trim()) {
      addContactEvent(lead.id, {
        type: contactType,
        description: contactDescription,
        outcome: contactOutcome || undefined,
      });
      setContactDescription('');
      setContactOutcome('');
      setShowAddContact(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-[400px] bg-card border-l border-border overflow-y-auto animate-slide-in-right z-30">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <QualityScoreBadge score={lead.qualityScore} size="lg" />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">{lead.businessName}</h2>
        <div className="flex items-center gap-2">
          <StatusBadge status={lead.status} />
          <span className="text-sm text-muted-foreground">
            Updated {format(lead.updatedAt, 'MMM d, yyyy')}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button 
            variant="gradient" 
            className="flex-1"
            onClick={() => navigate('/pitch-builder', { state: { lead } })}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Pitch
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setShowAddContact(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            Log Contact
          </Button>
        </div>

        {/* Status Update */}
        <Card className="p-4">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Update Status
          </label>
          <Select
            value={lead.status}
            onValueChange={(value) => updateLeadStatus(lead.id, value as LeadStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* Contact Info */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Business Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4 text-primary" />
              <span>{lead.industry}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{lead.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span>{lead.size}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="w-4 h-4 text-primary" />
              <a href={`https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                {lead.website}
              </a>
            </div>
            {lead.contactName && (
              <div className="pt-2 border-t border-border">
                <p className="font-medium text-foreground">{lead.contactName}</p>
                {lead.email && (
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-primary" />
                    <a href={`mailto:${lead.email}`} className="hover:text-primary transition-colors">
                      {lead.email}
                    </a>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-primary" />
                    <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">
                      {lead.phone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Add Contact Event */}
        {showAddContact && (
          <Card className="p-4 border-primary/30">
            <h3 className="font-semibold text-foreground mb-3">Log Contact</h3>
            <div className="space-y-3">
              <Select value={contactType} onValueChange={(v) => setContactType(v as typeof contactType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contactTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="What happened?"
                value={contactDescription}
                onChange={(e) => setContactDescription(e.target.value)}
              />
              <Input
                placeholder="Outcome (optional)"
                value={contactOutcome}
                onChange={(e) => setContactOutcome(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddContactEvent} className="flex-1">
                  Save
                </Button>
                <Button variant="outline" onClick={() => setShowAddContact(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Contact History */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Contact History
          </h3>
          {lead.contactHistory.length > 0 ? (
            <div className="space-y-3">
              {lead.contactHistory.map((event) => (
                <div key={event.id} className="relative pl-4 border-l-2 border-primary/30 pb-3 last:pb-0">
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary" />
                  <p className="text-sm font-medium text-foreground capitalize">{event.type}</p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  {event.outcome && (
                    <p className="text-sm text-success mt-1">Outcome: {event.outcome}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(event.createdAt, 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No contact history yet</p>
          )}
        </Card>

        {/* Notes */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Notes
          </h3>
          <div className="space-y-3">
            {lead.notes.map((note) => (
              <div key={note.id} className="p-3 bg-secondary rounded-lg">
                <p className="text-sm text-foreground">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {format(note.createdAt, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            ))}
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <Button onClick={handleAddNote} disabled={!newNote.trim()} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
