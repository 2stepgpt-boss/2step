import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((line) => line.includes('='))
    .map((line) => { const index = line.indexOf('='); return [line.slice(0, index), line.slice(index + 1).trim()]; }),
);

const groups = [
  ['people', 'People Advisory', "Mavuka's demonstration People Advisory playbook covers people strategy, fractional leadership, HR maturity, workforce planning, leadership alignment and governance. Actual scope is confirmed through consultation.", ['people strategy', 'HR strategy', 'human capital', 'fractional HR', 'interim HR leader', 'people management', 'workforce planning', 'leadership support', 'HR advisory', 'HR maturity', 'HR function']],
  ['transformation', 'Business Transformation', "Mavuka's demonstration transformation playbook covers organisational change, culture, operating-model clarity, stakeholder engagement, readiness and leadership alignment. Actual methodology is agreed for each engagement.", ['change management', 'business transformation', 'organisation transformation', 'culture change', 'organisational design', 'operating model', 'restructure', 'change readiness', 'stakeholder engagement', 'leadership alignment', 'organisation health']],
  ['recruitment', 'Recruitment and Talent', "Mavuka's demonstration talent playbook covers executive and specialist recruitment, talent attraction, role definition and candidate experience. Fees, guarantees and terms require direct confirmation.", ['recruitment', 'recruit', 'hire', 'hiring', 'executive search', 'talent', 'candidate', 'vacancy', 'specialist roles', 'talent attraction', 'candidate experience']],
  ['hrsetup', 'HR Function Setup', "Mavuka's demonstration HR setup playbook covers HR-function design, governance, policies, process design and capability uplift. Legal drafting, payroll and software configuration require confirmation.", ['HR department', 'HR setup', 'HR policies', 'HR governance', 'HR processes', 'HR function design', 'HR framework', 'HR operations', 'people policies', 'HR compliance', 'HR systems']],
  ['digital', 'Digital Workforce Readiness', "Mavuka's demonstration digital playbook focuses on workforce readiness, communication, adoption, learning needs and stakeholder engagement during technology change. It does not imply technical implementation.", ['digital transformation', 'technology change', 'technology adoption', 'AI readiness', 'AI adoption', 'digital skills', 'future skills', 'workforce readiness', 'change communication', 'employee adoption', 'digital fluency']],
  ['company', 'Company and Engagement', 'This demonstration presents Mavuka as an executive-led people and organisational advisory practice. Consultation, proposal, location, availability, privacy, supplier and commercial details are illustrative until approved.', ['what do you do', 'what do you specialise in', 'about Mavuka', 'company information', 'contact', 'location', 'availability', 'pricing', 'proposal', 'quote', 'consultation', 'B-BBEE', 'privacy', 'confidentiality', 'team', 'workshops', 'training', 'seminars']],
];
const starters = ['Can you help with', 'Do you offer', 'I need support with', 'Tell me about'];
const action = [{ id: 'request-consultation', label: 'Request a consultation' }];
const rows = [];

for (const [id, title, summary, topics] of groups) {
  rows.push({ installation_id: env.INSTALLATION_ID, document_id: `demo-playbook-${id}`, title, category: 'demo-only', source_type: 'demo_only', version: 'demo-expanded-1', owner: 'Demonstration only', approval_status: 'approved', access_level: 'public', source_location: 'demo://mavuka/illustrative', content: topics.join(' '), answer_summary: summary, key_points: [], approved_insight: 'Illustrative demonstration content - replace with Mavuka-approved information.', related_questions: [], suggested_actions: action });
  let number = 0;
  for (const topic of topics) for (const starter of starters) {
    number += 1;
    rows.push({ installation_id: env.INSTALLATION_ID, document_id: `demo-intent-${id}-${number}`, title, category: 'demo-only', source_type: 'demo_only', version: 'demo-expanded-1', owner: 'Demonstration only', approval_status: 'approved', access_level: 'public', source_location: 'demo://mavuka/illustrative', content: `${starter} ${topic}?`, answer_summary: summary, key_points: [], approved_insight: 'Illustrative demonstration content - replace with Mavuka-approved information.', related_questions: [], suggested_actions: action });
  }
}

if (rows.length !== 298) throw new Error(`Expected 298 records, generated ${rows.length}`);
const response = await fetch(`${env.SUPABASE_URL}/rest/v1/knowledge_documents`, { method: 'POST', headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(rows) });
if (!response.ok) throw new Error(await response.text());
console.log(`Loaded ${rows.length} expanded demo records.`);
