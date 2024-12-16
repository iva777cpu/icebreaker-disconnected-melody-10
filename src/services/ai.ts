import { createClient } from '@supabase/supabase-js';

// This will be replaced with actual Supabase client initialization
const supabase = null;

export const generateIceBreakers = async (context: Record<string, string>) => {
  try {
    const prompt = `Given the following context about a person and situation, generate 3 natural, engaging ice breakers that feel personal and appropriate:
    
    Context:
    ${Object.entries(context)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}
    
    Generate 3 different ice breakers that are casual, natural, and specific to the context provided.`;

    // This will be implemented once Supabase is connected
    // const { data, error } = await supabase.functions.invoke('generate-ice-breakers', {
    //   body: { prompt }
    // });

    // For now, return mock data
    return [
      "Hey! I noticed you seem really passionate about hiking. What's your favorite trail so far?",
      "I couldn't help but notice your enthusiasm for outdoor adventures. Got any exciting trips planned?",
      "Your love for nature really shows! What inspired you to start hiking?"
    ];
  } catch (error) {
    console.error('Error generating ice breakers:', error);
    throw error;
  }
};