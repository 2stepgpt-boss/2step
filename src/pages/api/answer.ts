import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '../../lib/supabase';

type SearchMatch = { document_id: string; title: string; excerpt: string; source_location: string | null };
type KnowledgeRecord = { document_id: string; title: string; content: string; source_type: string; answer_summary: string | null; key_points: string[] | null; approved_insight: string | null; related_questions: string[] | null; suggested_actions: unknown[] | null };
type ApprovedResource = { id: string; title: string; resource_type: string; resource_url: string; description: string | null };
type GroqAnswer = { title: string; summary: string; key_points: string[]; insight: string };

const intentSearches: Array<[RegExp, string[]]> = [
  [/price|pricing|cost|fee|package|quote|how much|charge|rate|budget/i, ['pricing and proposals', 'pricing']],
  [/speciali[sz]|what (do|can) you do|services?|offerings?/i, ['services', 'human capital advisory']],
  [/fractional|interim hr|senior hr leadership|part.?time chro|full.?time executive|hr director/i, ['fractional human capital leadership', 'senior HR support']],
  [/leadership development|leadership alignment|develop (our )?leaders/i, ['people and culture transformation', 'leadership alignment']],
  [/boss|founder|leader(ship)?|director|who runs/i, ['founder', 'leadership']],
  [/availab|opening|schedule|date|when can/i, ['availability', 'consultation']],
  [/contact|phone|email|call|reach/i, ['contact', 'telephone']],
  [/where|location|office|based/i, ['location', 'service area']],
  [/consult|discovery|engagement|how (do|does) .* work/i, ['engagement process', 'consultation']],
  [/supplier|vendor|procure/i, ['supplier onboarding']],
  [/recruit|hire|talent|candidate/i, ['recruitment', 'talent']],
  [/hr (function|setup|department|operations|polic)|set up .*hr|build .*hr/i, ['HR setup', 'HR function design']],
  [/change|transform|culture|restructur/i, ['organisational change', 'transformation']],
  [/hr |human resource|people strategy|workforce/i, ['human capital', 'hr function']],
  [/digital|technology|ai |adoption/i, ['digital workforce', 'technology adoption']],
];

function searchAttempts(question: string) {
  const mapped: string[] = [];
  for (const [pattern, terms] of intentSearches) if (pattern.test(question)) mapped.push(...terms);
  return [...new Set([...mapped, question.trim()])];
}

function parsedGroqAnswer(value: unknown): GroqAnswer | null {
  if (!value || typeof value !== 'object') return null;
  const answer = value as Record<string, unknown>;
  if (typeof answer.title !== 'string' || typeof answer.summary !== 'string' || typeof answer.insight !== 'string' || !Array.isArray(answer.key_points)) return null;
  return { title: answer.title.slice(0, 100), summary: answer.summary.slice(0, 1000), key_points: answer.key_points.filter((point): point is string => typeof point === 'string').slice(0, 4), insight: answer.insight.slice(0, 500) };
}

async function writeWithGroq(question: string, records: KnowledgeRecord[]) {
  const apiKey = import.meta.env.GROQ_API_KEY;
  if (!apiKey) return null;
  const sourceContext = records.map((record, index) => `[Source ${index + 1}: ${record.title}; ${record.source_type}]\n${record.content.slice(0, 2600)}\nApproved summary: ${record.answer_summary || 'None'}`).join('\n\n');
  const prompt = `You are the Mavuka People Advisory website assistant. Answer the visitor using only the supplied knowledge sources. Do not invent facts, services, credentials, prices, dates, clients, or contact details. If the answer is not supported by the sources, say so briefly and recommend speaking to a human. Do not mention the words "knowledge base" or "retrieval". Do not say material is fictional; the interface handles presentation labels. Use clear, confident South African business English.\n\nReturn valid JSON only with exactly these fields: title (short), summary (2-4 useful sentences), key_points (array of 3 or 4 short strings), insight (one practical next-step sentence).\n\nVisitor question: ${question}\n\nSources:\n${sourceContext}`;
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openai/gpt-oss-20b', temperature: 0.2, max_completion_tokens: 500, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: prompt }] }),
    });
    if (!response.ok) return null;
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return null;
    return parsedGroqAnswer(JSON.parse(content));
  } catch {
    return null;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { question, resourceQuestionTitle } = await request.json();
    const installationId = import.meta.env.INSTALLATION_ID;
    if (!installationId || typeof question !== 'string' || !question.trim() || question.length > 600) return Response.json({ error: 'Please enter a question of up to 600 characters.' }, { status: 400 });

    let matches: SearchMatch[] | null = null;
    for (const query of searchAttempts(question)) {
      const { data, error } = await getSupabaseAdmin().rpc('search_approved_knowledge', { p_installation_id: installationId, p_query: query, p_limit: 4 });
      if (error) throw error;
      if (data?.length) { matches = data; break; }
    }
    if (!matches?.length) return Response.json({ status: 'not_found', title: 'No approved answer available', summary: 'We do not have verified information for that question yet. Speak to Mavuka directly for the right guidance.', sources: [] });

    const ids = matches.map((match) => match.document_id);
    const { data: records, error } = await getSupabaseAdmin().from('knowledge_documents').select('document_id,title,content,source_type,answer_summary,key_points,approved_insight,related_questions,suggested_actions').eq('installation_id', installationId).eq('approval_status', 'approved').eq('access_level', 'public').in('document_id', ids);
    if (error || !records?.length) throw error || new Error('No source records found.');
    const orderedRecords = ids.map((id) => records.find((record) => record.document_id === id)).filter((record): record is KnowledgeRecord => Boolean(record));
    const primary = orderedRecords[0];
    const resourceResult = await getSupabaseAdmin().from('knowledge_resources').select('id,title,resource_type,resource_url,description').eq('installation_id', installationId).eq('approval_status', 'approved').eq('access_level', 'public').in('document_id', ids);
    const questionResourceResult = typeof resourceQuestionTitle === 'string' && resourceQuestionTitle.length <= 180 ? await getSupabaseAdmin().from('knowledge_resources').select('id,title,resource_type,resource_url,description').eq('installation_id', installationId).eq('approval_status', 'approved').eq('access_level', 'public').eq('question_title', resourceQuestionTitle) : { data: [], error: null };
    const resources: ApprovedResource[] = [...(resourceResult.error ? [] : resourceResult.data || []), ...(questionResourceResult.error ? [] : questionResourceResult.data || [])].filter((resource, index, list) => list.findIndex((candidate) => candidate.id === resource.id) === index);
    const generated = await writeWithGroq(question, orderedRecords);

    return Response.json({
      status: 'grounded',
      ai: Boolean(generated),
      demo: orderedRecords.some((record) => record.source_type === 'demo_only'),
      title: generated?.title || primary.title,
      summary: generated?.summary || primary.answer_summary || matches[0].excerpt,
      key_points: generated?.key_points?.length ? generated.key_points : primary.key_points || [],
      insight: generated?.insight || primary.approved_insight || null,
      related_questions: primary.related_questions || [],
      suggested_actions: primary.suggested_actions || [],
      sources: matches.map((match) => ({ id: match.document_id, title: match.title, url: match.source_location })),
      resources,
    });
  } catch (error) {
    console.error('Answer service failed.', error instanceof Error ? error.message : 'A data-provider error occurred.');
    return Response.json({ error: 'The knowledge service is temporarily unavailable.' }, { status: 503 });
  }
};
