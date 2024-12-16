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
    
    const filledAnswers = Object.entries(answers)
      .filter(([_, value]) => value && value.toString().trim() !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const userTraits = {
      comeAcross: filledAnswers.comeAcross,
      yourAge: filledAnswers.yourAge,
      preferredTopics: filledAnswers.preferredTopics
    };

    const targetTraits = { ...filledAnswers };
    delete targetTraits.comeAcross;
    delete targetTraits.yourAge;
    delete targetTraits.preferredTopics;

    const prompt = `Generate 3 ${isFirstTime ? 'first-time conversation' : ''} ice breakers based on these traits of the person I want to talk to:
    ${Object.entries(targetTraits)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}
    
    Important guidelines:
    - Keep responses under 30 words each
    - Be casual and natural, avoid being cheesy or overly familiar
    - Return exactly 3 ice breakers, numbered 1-3
    - No introductory text or explanations
    - No exclamation marks or emojis
    ${isFirstTime ? '- These should be suitable for a first-time conversation ice breakers' : ''}`;

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
            content: 'You are a concise assistant that generates short, natural conversation starters. No fluff or explanations, just the ice breakers.'
          },
          { role: 'user', content: prompt }
        ],
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
