import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { pitchTemplates } from '@/data/mockData';
import { Lead } from '@/types/lead';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Lightbulb, 
  Target,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGeneratePitch } from '@/hooks/useGeneratePitch';

export default function PitchBuilder() {
  const location = useLocation();
  const { toast } = useToast();
  const leadFromState = location.state?.lead as Lead | undefined;

  const [selectedIndustry, setSelectedIndustry] = useState(
    leadFromState?.industry || 'Restaurants'
  );
  const [businessName, setBusinessName] = useState(leadFromState?.businessName || '');
  const [contactName, setContactName] = useState(leadFromState?.contactName || '');
  const [businessLocation, setBusinessLocation] = useState(leadFromState?.location || '');
  const [businessSize, setBusinessSize] = useState(leadFromState?.size || '1-10 employees');
  const [copied, setCopied] = useState(false);
  
  const { isGenerating, generatedPitch, setGeneratedPitch, generatePitch } = useGeneratePitch();

  const currentTemplate = pitchTemplates.find(t => t.industry === selectedIndustry) || pitchTemplates[0];

  useEffect(() => {
    if (leadFromState) {
      setSelectedIndustry(leadFromState.industry);
      setBusinessName(leadFromState.businessName);
      setContactName(leadFromState.contactName || '');
      setBusinessLocation(leadFromState.location);
      setBusinessSize(leadFromState.size);
    }
  }, [leadFromState]);

  const handleGeneratePitch = () => {
    generatePitch({
      businessName: businessName || '[Business Name]',
      industry: selectedIndustry,
      location: businessLocation || '[Location]',
      size: businessSize,
      contactName: contactName || undefined,
      painPoints: currentTemplate.painPoints,
      solutions: currentTemplate.solutions,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPitch);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Your pitch has been copied and is ready to send.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Pitch Builder</h1>
          <p className="text-muted-foreground">Create personalized pitches for your AI solutions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card className="p-6 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Select Industry</h2>
                  <p className="text-sm text-muted-foreground">Choose the template that fits</p>
                </div>
              </div>

              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pitchTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.industry}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {/* Business Details */}
            <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Business Details</h2>
                  <p className="text-sm text-muted-foreground">Personalize your pitch</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Business Name</Label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <Label>Contact Name</Label>
                  <Input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={businessLocation}
                    onChange={(e) => setBusinessLocation(e.target.value)}
                    placeholder="Enter location"
                  />
                </div>
              </div>
            </Card>

            {/* Pain Points & Solutions */}
            <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Industry Insights</h2>
                  <p className="text-sm text-muted-foreground">Auto-suggested talking points</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Common Pain Points</h4>
                  <ul className="space-y-2">
                    {currentTemplate.painPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">AI Solutions</h4>
                  <ul className="space-y-2">
                    {currentTemplate.solutions.map((solution, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <Button 
              variant="gradient" 
              size="xl" 
              className="w-full" 
              onClick={handleGeneratePitch}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Pitch
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            <Card className="p-6 min-h-[500px] animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Generated Pitch</h2>
                    <p className="text-sm text-muted-foreground">Ready to copy and send</p>
                  </div>
                </div>
                {generatedPitch && (
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-success" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>

              {generatedPitch ? (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-2">Subject Line:</p>
                    <p className="text-muted-foreground">
                      Transforming {businessName || '[Business]'} with AI-Powered Solutions
                    </p>
                  </div>
                  <Textarea
                    value={generatedPitch}
                    onChange={(e) => setGeneratedPitch(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Your generated pitch will appear here..."
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Ready to create magic</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Fill in the business details and click "Generate" to create a personalized pitch
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
