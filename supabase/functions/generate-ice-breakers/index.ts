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
    const { answers } = await req.json();
    
    const prompt = `Given the following information about a person, generate 3 natural, engaging ice breakers that feel personal and appropriate:
    
    ${Object.entries(answers)
      .filter(([_, value]) => value) // Only include answered questions
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}
    
    Generate 3 different ice breakers that are casual, natural, and specific to the information provided. Focus on their interests, hobbies, and what they're passionate about.`;

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
            content: 'You are a friendly assistant that helps generate natural, engaging ice breakers based on information about a person. Your responses should be conversational and show genuine interest.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const iceBreakers = data.choices[0].message.content
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3);

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