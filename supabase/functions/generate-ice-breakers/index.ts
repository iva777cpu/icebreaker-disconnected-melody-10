import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, isFirstTime } = await req.json();
    
    const temperatures = Object.values(answers).map((data: any) => data.temperature);
    const avgTemperature = temperatures.reduce((a: number, b: number) => a + b, 0) / temperatures.length;
    
    const context = Object.entries(answers)
      .map(([key, data]: [string, any]) => `${key}: ${data.value} (${data.prompt})`)
      .join('\n');

    const prompt = `Generate 3 engaging ice breakers based on this context:
    ${context}
    
    Important guidelines:
    - Mix between different formats:
      * Casual questions
      * Fun facts or observations
      * Light-hearted statements
      * Friendly banter (when appropriate)
    - Keep responses under 30 words each
    - Be natural and conversational
    - Return exactly 3 ice breakers, numbered 1-3
    - No introductory text or explanations
    - Consider both the speaker's traits and the target's characteristics
    ${isFirstTime ? '- These should be suitable for a first-time conversation, so keep it light and approachable' : ''}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a friendly conversation starter that mixes questions, statements, and fun facts to create engaging ice breakers.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: isFirstTime ? 0.8 : avgTemperature,
      }),
    });

    const data = await response.json();
    const iceBreakers = data.choices[0].message.content
      .split('\n')
      .filter(line => line.trim() && line.match(/^\d\./))
      .map(line => line.replace(/^\d\.\s*/, '').trim());

    return new Response(JSON.stringify({ iceBreakers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ice-breakers function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});