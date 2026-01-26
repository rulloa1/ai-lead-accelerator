import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadData {
  businessName: string;
  industry: string;
  location: string;
  size: string;
  contactName?: string;
  painPoints?: string[];
  solutions?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead } = await req.json() as { lead: LeadData };
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert B2B sales copywriter specializing in AI solutions. Your task is to write personalized, compelling email pitches that:
- Open with a specific observation about the business
- Address industry-specific pain points
- Present AI solutions as practical, not hype
- Include a clear call-to-action
- Sound human and conversational, not robotic
- Are concise (under 200 words)

Never use generic phrases like "I hope this email finds you well." Be specific and value-driven.`;

    const painPointsText = lead.painPoints?.length 
      ? `Known pain points in this industry: ${lead.painPoints.join(", ")}`
      : "";
    
    const solutionsText = lead.solutions?.length
      ? `Relevant AI solutions: ${lead.solutions.join(", ")}`
      : "";

    const userPrompt = `Write a personalized cold email pitch for an AI solutions company targeting this business:

Business: ${lead.businessName}
Industry: ${lead.industry}
Location: ${lead.location}
Size: ${lead.size}
Contact: ${lead.contactName || "Business Owner"}

${painPointsText}
${solutionsText}

Write the email body only (no subject line). Make it specific to their industry and compelling enough to get a response.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate pitch" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-pitch error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
