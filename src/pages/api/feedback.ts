import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { question, helpful } = await request.json();
    const installationId = import.meta.env.INSTALLATION_ID;
    if (!installationId || typeof question !== 'string' || !question.trim() || question.length > 600 || typeof helpful !== 'boolean') {
      return Response.json({ error: 'Invalid feedback.' }, { status: 400 });
    }
    const { error } = await getSupabaseAdmin().from('question_feedback').insert({ installation_id: installationId, question: question.trim(), helpful });
    if (error) throw error;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Feedback could not be saved.' }, { status: 503 });
  }
};
