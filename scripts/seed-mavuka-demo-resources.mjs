import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((line) => line.includes('=')).map((line) => {
  const index = line.indexOf('=');
  return [line.slice(0, index), line.slice(index + 1).trim()];
}));

function makePdf(title, lines) {
  const text = [title, ...lines].map((line, index) => `BT /F1 ${index === 0 ? 18 : 11} Tf 72 ${760 - index * 24} Td (${line.replace(/[()\\]/g, '\\$&')}) Tj ET`).join('\n');
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${Buffer.byteLength(text)} >>\nstream\n${text}\nendstream`];
  let output = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(output)); output += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(output);
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(output, 'utf8');
}

const destination = join('public', 'demo-resources');
mkdirSync(destination, { recursive: true });
writeFileSync(join(destination, 'fractional-hc-readiness-guide.pdf'), makePdf('Fractional HC Leadership: Readiness Guide', ['Demonstration resource only — replace with Mavuka-approved content.', 'Use this short guide to assess leadership capacity, priority decisions and engagement readiness.']));
writeFileSync(join(destination, 'organisation-design-checklist.pdf'), makePdf('Organisation Design: First-Step Checklist', ['Demonstration resource only — replace with Mavuka-approved content.', 'Review structure, decision rights, role clarity and operating-model alignment.']));

const resources = [
  { installation_id: env.INSTALLATION_ID, document_id: 'demo-engagement-1', question_title: 'Is fractional HC leadership right for us?', title: 'Fractional HC Leadership: Readiness Guide', resource_type: 'pdf', resource_url: '/demo-resources/fractional-hc-readiness-guide.pdf', description: 'Demonstration PDF resource', approval_status: 'approved', access_level: 'public' },
  { installation_id: env.INSTALLATION_ID, document_id: 'demo-engagement-1', question_title: 'Do we need to redesign our organisation?', title: 'Organisation Design: First-Step Checklist', resource_type: 'checklist', resource_url: '/demo-resources/organisation-design-checklist.pdf', description: 'Demonstration checklist resource', approval_status: 'approved', access_level: 'public' }
];

const response = await fetch(`${env.SUPABASE_URL}/rest/v1/knowledge_resources`, { method: 'POST', headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(resources) });
if (!response.ok) throw new Error(await response.text());
console.log('Created 2 demo PDF resources and registered their approved resource records.');
