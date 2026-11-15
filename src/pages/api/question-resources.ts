import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { questionTitles } = await request.json();
    const installationId = import.meta.env.INSTALLATION_ID;
    if (!installationId || !Array.isArray(questionTitles) || questionTitles.length > 8 || questionTitles.some((title) => typeof title !== 'string' || title.length > 180)) {
      return Response.json({ error: 'Invalid question resource request.' }, { status: 400 });
    }
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await getSupabaseAdmin().from('knowledge_resources').select('question_title,resource_type').eq('installation_id', installationId).eq('approval_status', 'approved').eq('access_level', 'public').in('question_title', questionTitles).or(`effective_date.is.null,effective_date.lte.${today}`).or(`expiry_date.is.null,expiry_date.gt.${today}`);
    if (error) throw error;
    const formatsByQuestion: Record<string, string[]> = {};
    for (const resource of data || []) {
      if (!resource.question_title) continue;
      (formatsByQuestion[resource.question_title] ||= []).push(resource.resource_type);
    }
    for (const title of Object.keys(formatsByQuestion)) formatsByQuestion[title] = [...new Set(formatsByQuestion[title])];
    return Response.json({ formatsByQuestion });
  } catch {
    return Response.json({ formatsByQuestion: {} });
  }
};
