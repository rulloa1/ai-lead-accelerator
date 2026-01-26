import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LeadData {
  businessName: string;
  industry: string;
  location: string;
  size: string;
  contactName?: string;
  painPoints?: string[];
  solutions?: string[];
}

const GENERATE_PITCH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pitch`;

export function useGeneratePitch() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState('');
  const { toast } = useToast();

  const generatePitch = useCallback(async (lead: LeadData) => {
    setIsGenerating(true);
    setGeneratedPitch('');

    try {
      const response = await fetch(GENERATE_PITCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ lead }),
      });

      if (!response.ok || !response.body) {
        const error = await response.json().catch(() => ({ error: 'Failed to generate pitch' }));
        
        if (response.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait a moment before generating another pitch.",
            variant: "destructive",
          });
        } else if (response.status === 402) {
          toast({
            title: "Credits exhausted",
            description: "Please add AI credits to continue generating pitches.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Generation failed",
            description: error.error || "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
        setIsGenerating(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let pitchContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              pitchContent += content;
              setGeneratedPitch(pitchContent);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              pitchContent += content;
              setGeneratedPitch(pitchContent);
            }
          } catch { /* ignore */ }
        }
      }

      setIsGenerating(false);
    } catch (error) {
      console.error('Generate pitch error:', error);
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  }, [toast]);

  return {
    isGenerating,
    generatedPitch,
    setGeneratedPitch,
    generatePitch,
  };
}
