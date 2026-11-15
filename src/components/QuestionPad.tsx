import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, Building2, CalendarDays, Check, ChevronDown, CircleDollarSign, Clipboard, Copy, FileText, Heart, Home, Mail, Menu, MessageCircle, MessageSquare, Package, PanelLeftClose, PanelLeftOpen, Phone, Plus, Scale, Send, ShoppingCart, Sparkles, Wand2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '../config/site';
import PillMorphTabs from './PillMorphTabs';

type ResultKind = 'summary' | 'document' | 'analysis' | 'general';
const iconFor: Record<ResultKind, typeof FileText> = { summary: FileText, document: Clipboard, analysis: Sparkles, general: Wand2 };
const navIcons = [Home, Menu, Sparkles, BookOpen, BookOpen, ShoppingCart, Mail];
const whatsappHref = (context = 'I would like to speak to a human at Mavuka People Advisory.') => `https://wa.me/27722963758?text=${encodeURIComponent(`Hi Mavuka, ${context}`)}`;
type QuestionCard = { title: string; description: string; question: string; type: ResultKind };
const questionCardsByNiche: Record<string, QuestionCard[]> = {
  'Fractional HC Leadership': [
    { title: 'Is fractional HC leadership right for us?', description: 'Explore when flexible senior human-capital leadership adds value.', question: 'When is fractional human capital leadership the right choice for an organisation?', type: 'summary' },
    { title: 'What can a fractional HC leader own?', description: 'Understand the scope of senior people leadership support.', question: 'What responsibilities can a fractional HC leader take ownership of?', type: 'analysis' },
    { title: 'How would Mavuka assess our priorities?', description: 'Start with the people decisions that matter most.', question: 'How would Mavuka assess our immediate people and leadership priorities?', type: 'general' },
    { title: 'What engagement options are available?', description: 'Explore a practical support model for your business.', question: 'What fractional HC engagement options can Mavuka provide?', type: 'document' }
  ],
  'People & Culture Transformation': [
    { title: 'How do we begin culture transformation?', description: 'Identify a focused starting point for meaningful change.', question: 'How can we begin a people and culture transformation?', type: 'summary' },
    { title: 'What does a healthy culture programme include?', description: 'Explore the core elements of sustainable culture change.', question: 'What should a healthy culture transformation programme include?', type: 'analysis' },
    { title: 'How can we improve employee experience?', description: 'Consider practical ways to strengthen the employee journey.', question: 'How can we improve our employee experience and engagement?', type: 'general' },
    { title: 'How is culture change measured?', description: 'Ask about outcomes, signals and progress tracking.', question: 'How can an organisation measure culture change progress?', type: 'document' }
  ],
  'HR Function Optimisation': [
    { title: 'Is our HR function fit for purpose?', description: 'Review the effectiveness of your current HR service.', question: 'How can we assess whether our HR function is fit for purpose?', type: 'summary' },
    { title: 'Where can HR become more efficient?', description: 'Find opportunities to improve process, service and capacity.', question: 'Where can an HR function become more efficient and effective?', type: 'analysis' },
    { title: 'What should HR prioritise first?', description: 'Turn broad improvement needs into an action plan.', question: 'What should an HR function prioritise first when improving?', type: 'general' },
    { title: 'Can Mavuka review our HR operating model?', description: 'Explore a structured HR optimisation review.', question: 'Can Mavuka review and optimise our HR operating model?', type: 'document' }
  ],
  'Organisational Design & Operating Model': [
    { title: 'Do we need to redesign our organisation?', description: 'Recognise the signs that structure or decision-making needs attention.', question: 'How do we know whether we need organisational redesign?', type: 'summary' },
    { title: 'How do we clarify roles and accountability?', description: 'Explore a clearer operating structure for teams.', question: 'How can we clarify roles, accountability and decision rights?', type: 'analysis' },
    { title: 'What makes an operating model effective?', description: 'Understand the building blocks of practical execution.', question: 'What makes an operating model effective?', type: 'general' },
    { title: 'How can structure support our strategy?', description: 'Connect organisational design to business priorities.', question: 'How can organisational design better support our business strategy?', type: 'document' }
  ],
  'Recruitment Services': [
    { title: 'Can Mavuka help us hire critical talent?', description: 'Explore executive and specialist recruitment support.', question: 'Can Mavuka help us recruit critical executive or specialist talent?', type: 'summary' },
    { title: 'How do we define the right role?', description: 'Start with role clarity before going to market.', question: 'How can we define the right role before starting recruitment?', type: 'analysis' },
    { title: 'How can we improve candidate experience?', description: 'Strengthen how candidates experience your organisation.', question: 'How can we improve our candidate experience during recruitment?', type: 'general' },
    { title: 'What does a search engagement involve?', description: 'Understand the recruitment process and next steps.', question: 'What does a Mavuka recruitment search engagement involve?', type: 'document' }
  ],
  'HR Practice Management Setup': [
    { title: 'What does a strong HR practice need?', description: 'Explore the essentials of an effective HR foundation.', question: 'What does a strong and well-managed HR practice need?', type: 'summary' },
    { title: 'Which HR policies should we prioritise?', description: 'Focus policy work on the needs of your organisation.', question: 'Which HR policies and practices should we prioritise first?', type: 'analysis' },
    { title: 'How can we improve HR governance?', description: 'Build clearer, more reliable people-management processes.', question: 'How can we improve HR governance and practice management?', type: 'general' },
    { title: 'Can Mavuka help set up our HR practice?', description: 'Explore implementation support for your HR foundation.', question: 'Can Mavuka help us set up or strengthen an HR practice?', type: 'document' }
  ]
};

function SpeakToHuman({ context, floating = false }: { context?: string; floating?: boolean }) {
  return <a href={whatsappHref(context)} target="_blank" rel="noreferrer" className={floating ? 'fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#4d5a28] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#3d491f]' : 'action border-[#cbd6af] bg-[#f5f8eb] text-[#3d491f] hover:bg-[#e8f0d4]'}><MessageCircle size={17}/><span className={floating ? 'hidden sm:inline' : ''}>Speak to a human</span></a>;
}

function FollowUpModal({ value, onChange, onClose, onSubmit }: { value: string; onChange: (value: string) => void; onClose: () => void; onSubmit: () => void }) {
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-[#252525]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="follow-up-title" onMouseDown={onClose}><form onSubmit={(event) => { event.preventDefault(); onSubmit(); }} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-[#ded9d0] bg-white p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-4"><div><h2 id="follow-up-title" className="text-2xl font-bold text-[#252525]">Ask a follow-up</h2><p className="mt-1 text-sm text-[#56546a]">Your new question will keep the previous answer as context.</p></div><button type="button" onClick={onClose} aria-label="Close follow-up" className="grid h-9 w-9 place-items-center rounded-full bg-[#f0ece4] text-[#4d5a28]"><X size={18}/></button></div><textarea autoFocus value={value} onChange={(event) => onChange(event.target.value)} placeholder="Ask your next question..." rows={4} className="mt-5 w-full resize-none rounded-2xl border border-[#ded9d0] p-3 text-sm outline-none focus:border-[#6b7c3a]"/><div className="mt-4 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-semibold text-[#4f4c61]">Cancel</button><button disabled={!value.trim()} className="inline-flex items-center gap-2 rounded-full bg-[#4d5a28] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Send size={16}/>Ask follow-up</button></div></form></div>;
}

function ServiceContextCards({ niche, onAsk, onTakeAction }: { niche: string; onAsk: (question: string) => void; onTakeAction: (niche: string) => void }) {
  return <aside className="mt-4 grid gap-3 sm:-mt-[260px] sm:ml-[51%] sm:w-[45%]">
    <button onClick={() => onAsk(`Why should we choose Mavuka People Advisory for ${niche}?`)} className="flex items-center justify-between rounded-xl border border-[#e5e1ec] bg-white p-3 text-left shadow-sm transition hover:border-[#8a9e4a] hover:shadow-md"><h2 className="text-lg font-bold">Why Mavuka</h2><ArrowUpRight size={18} className="text-[#4d5a28]"/></button>
    <button onClick={() => onAsk(`What outcomes could we expect from ${niche} support?`)} className="flex items-center justify-between rounded-xl border border-[#e5e1ec] bg-[#f7f5ef] p-3 text-left shadow-sm transition hover:border-[#8a9e4a] hover:shadow-md"><h2 className="text-lg font-bold">Expected outcome</h2><Sparkles size={18} className="text-[#4d5a28]"/></button>
    <button onClick={() => onTakeAction(niche)} className="flex items-center justify-between rounded-xl border border-[#e5e1ec] bg-white p-3 text-left shadow-sm transition hover:border-[#8a9e4a] hover:shadow-md"><h2 className="text-lg font-bold">Take action</h2><MessageCircle size={18} className="text-[#4d5a28]"/></button>
  </aside>;
}

type ApprovedResource = { id: string; title: string; resource_type: string; resource_url: string; description?: string | null };
function ResourceLinks({ resources }: { resources: ApprovedResource[] }) {
  const [openResource, setOpenResource] = useState<ApprovedResource | null>(null);
  if (!resources.length) return null;
  return <section className="mt-3 rounded-2xl border border-[#e8e3f0] bg-white p-3"><h2 className="flex items-center gap-2 text-lg font-extrabold"><FileText size={20} className="text-[#4d5a28]"/>Available resources</h2><div className="mt-2 flex flex-wrap gap-2">{resources.map((resource) => <button key={resource.id} onClick={() => setOpenResource(resource)} className="inline-flex items-center gap-1 rounded-full border border-[#cbd6af] bg-[#f5f8eb] px-3 py-1.5 text-xs font-bold text-[#3d491f]"><FileText size={14}/>{resource.resource_type.replace('_', ' ')} · {resource.title}</button>)}</div>{openResource && <div className="mt-3 overflow-hidden rounded-xl border border-[#ded9d0] bg-white"><div className="flex items-center justify-between border-b border-[#ded9d0] px-3 py-2"><b className="text-sm">{openResource.title}</b><button onClick={() => setOpenResource(null)} className="rounded-lg px-2 py-1 text-xs font-bold text-[#4d5a28] hover:bg-[#f0ece4]">Close reader</button></div><iframe title={openResource.title} src={openResource.resource_url} className="h-[520px] w-full bg-white"/></div>}</section>;
  return <section className="mt-3 rounded-2xl border border-[#e8e3f0] bg-white p-3"><h2 className="flex items-center gap-2 text-lg font-extrabold"><FileText size={20} className="text-[#4d5a28]"/>Available resources</h2><div className="mt-2 flex flex-wrap gap-2">{resources.map((resource) => <a key={resource.id} href={resource.resource_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-[#cbd6af] bg-[#f5f8eb] px-3 py-1.5 text-xs font-bold text-[#3d491f]"><FileText size={14}/>{resource.resource_type.replace('_', ' ')} · {resource.title}</a>)}</div></section>;
}

function ActionChoices({ niche }: { niche: string }) {
  return <section className="mt-3 rounded-2xl border border-[#cbd6af] bg-[#f5f8eb] p-3"><h2 className="text-lg font-extrabold text-[#3d491f]">Choose your next step</h2><p className="mt-1 text-sm text-[#4f4c61]">Connect with Mavuka about {niche.toLowerCase()} in the way that works best for you.</p><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><a href="tel:+27722963758" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd6af] bg-white px-3 py-2 text-sm font-bold text-[#3d491f]"><Phone size={16}/>Call</a><a href={whatsappHref(`I would like to discuss ${niche}.`)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd6af] bg-white px-3 py-2 text-sm font-bold text-[#3d491f]"><MessageCircle size={16}/>WhatsApp</a><a href="/contact?type=meeting" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd6af] bg-white px-3 py-2 text-sm font-bold text-[#3d491f]"><CalendarDays size={16}/>Book a meeting</a><a href="/contact?type=demo" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4d5a28] px-3 py-2 text-sm font-bold text-white"><Sparkles size={16}/>Book a demo</a></div></section>;
}

function AnswerFeedback({ question }: { question: string }) {
  const [submitted, setSubmitted] = useState(false);
  const sendFeedback = async (helpful: boolean) => {
    setSubmitted(true);
    await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, helpful }) }).catch(() => undefined);
  };
  return <div className="mt-3 flex items-center gap-2 text-sm text-[#4f4c61]"><span>Was this answer helpful?</span>{submitted ? <b className="text-[#4d5a28]">Thank you.</b> : <><button onClick={() => sendFeedback(true)} className="rounded-full border border-[#cbd6af] bg-white px-3 py-1 font-bold text-[#3d491f]">Yes</button><button onClick={() => sendFeedback(false)} className="rounded-full border border-[#ded9d0] bg-white px-3 py-1 font-bold text-[#4f4c61]">Not yet</button></>}</div>;
}

function resultFor(question: string, kind: ResultKind) {
  const topic = question.trim() || 'your request';
  return {
    question: topic,
    demo: false,
    kind,
    title: kind === 'document' ? 'Your Proposal Draft' : kind === 'analysis' ? 'Your UI Review' : 'Your Result',
    intro: kind === 'document' ? 'A clear starting point you can adapt for your client, project, or service.' : kind === 'analysis' ? 'A focused review with practical improvements to make the experience clearer and more effective.' : `Here’s a concise answer for “${topic}”, with practical takeaways and recommended next steps.`,
    summary: kind === 'document' ? 'This proposal outlines a professional, outcome-focused approach, a clear scope of work, and a practical next step for getting started.' : kind === 'analysis' ? 'The strongest experiences make the primary action unmistakable, build confidence early, and remove unnecessary friction at every step.' : 'The best answer is clear, structured, and immediately useful. It turns a broad question into a focused set of decisions and actions.',
    points: ['Lead with the clearest value proposition', 'Make the next action easy to understand', 'Use a simple structure people can scan', 'Refine based on the audience and context'],
    insight: 'Start with the essential outcome. A few targeted improvements—clear hierarchy, credible detail, and a direct call to action—can make the response substantially more useful.'
  };
}

export default function QuestionPad() {
  const [query, setQuery] = useState('');
  const [activeNiche, setActiveNiche] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof resultFor> | null>(null);
  const [copied, setCopied] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [resources, setResources] = useState<ApprovedResource[]>([]);
  const [actionNiche, setActionNiche] = useState<string | null>(null);
  const [showHeroSubtitle, setShowHeroSubtitle] = useState(false);
  useEffect(() => {
    const interceptFollowUp = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest('button');
      if (button?.classList.contains('action') && button.textContent?.trim().includes('Ask follow-up')) { event.preventDefault(); event.stopPropagation(); setFollowUpOpen(true); }
    };
    document.addEventListener('click', interceptFollowUp, true);
    return () => document.removeEventListener('click', interceptFollowUp, true);
  }, []);
  useEffect(() => { const q = new URLSearchParams(location.search).get('article'); if(q) setQuery(`Based on the article “${q}”, help me understand the key ideas.`); }, []);
  useEffect(() => {
    if (window.sessionStorage.getItem('mavuka-hero-subtitle-seen')) return;
    setShowHeroSubtitle(true);
    const timer = window.setTimeout(() => {
      setShowHeroSubtitle(false);
      window.sessionStorage.setItem('mavuka-hero-subtitle-seen', 'true');
    }, 7000);
    return () => window.clearTimeout(timer);
  }, []);
  const cardList = useMemo(() => activeNiche ? (questionCardsByNiche[activeNiche] ?? siteConfig.cards) : [], [activeNiche]);
  useEffect(() => {
    const removeBadges = () => document.querySelectorAll('.question-resource-badges').forEach((badge) => badge.remove());
    removeBadges();
    if (!activeNiche || !cardList.length) return;
    const controller = new AbortController();
    fetch('/api/question-resources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionTitles: cardList.map((card) => card.title) }), signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => {
        const formatsByQuestion = payload.formatsByQuestion as Record<string, string[]> | undefined;
        if (!formatsByQuestion) return;
        document.querySelectorAll<HTMLButtonElement>('button.group.min-h-14').forEach((button) => {
          const title = button.querySelector('h2')?.textContent?.trim() || '';
          const formats = formatsByQuestion[title];
          const content = button.querySelector('span.min-w-0.flex-1');
          if (!formats?.length || !content) return;
          const badges = document.createElement('span');
          badges.className = 'question-resource-badges';
          formats.forEach((format) => {
            const badge = document.createElement('span');
            badge.textContent = format.replace('_', ' ');
            badges.appendChild(badge);
          });
          content.appendChild(badges);
        });
      }).catch(() => undefined);
    return () => controller.abort();
  }, [activeNiche, cardList]);
  useEffect(() => {
    const cards = Array.from(document.querySelectorAll('button')).filter((button) => ['Our Expertise', 'Our Approach'].includes(button.querySelector('h2')?.textContent || ''));
    cards.forEach((card) => { card.style.display = activeTab === 'Why Mavuka?' ? 'none' : ''; });
  }, [activeTab]);
  const submit = async (value = query, kind: ResultKind = 'general', displayQuestion = value) => {
    if (!value.trim()) return;
    setActionNiche(null);
    try {
      const resourceQuestionTitle = Object.values(questionCardsByNiche).flat().find((card) => card.question === value)?.title;
      const response = await fetch('/api/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: value, resourceQuestionTitle }) });
      const payload = await response.json();
      setResources(Array.isArray(payload.resources) ? payload.resources : []);
      const base = resultFor(displayQuestion, kind);
      setResult({ ...base, demo: Boolean(payload.demo), title: payload.title || 'Knowledge service unavailable', intro: payload.summary || 'We could not find an approved answer for this question.', summary: payload.summary || 'Please contact the business for verified assistance.', points: payload.key_points?.length ? payload.key_points : (payload.sources?.length ? payload.sources.map((source: { title: string }) => source.title) : ['No supported answer was found', 'Contact Us can help with this request']), insight: payload.insight || (payload.status === 'not_found' ? 'Try a service question, refine your wording, or ask Mavuka directly for verified guidance.' : 'This response is matched to the available knowledge base.') });
    } catch { setResources([]); setResult({ ...resultFor(value, kind), title: 'Knowledge service unavailable', intro: 'We could not check the approved knowledge base right now.', summary: 'Please try again later or contact the business directly.' }); }
  };
  const showActionChoices = (niche: string) => {
    setResources([]);
    setActionNiche(niche);
    setResult({ ...resultFor(`Take the next step with Mavuka for ${niche}`, 'general'), title: 'Take the next step', intro: `Choose how you would like to start a conversation with Mavuka about ${niche.toLowerCase()}.`, summary: 'Mavuka can arrange an introductory discussion, consultation or demonstration to understand your priorities and agree a practical next step.', points: ['Speak directly with a Mavuka advisor', 'Book a meeting at a suitable time', 'Request a focused demonstration', 'Start the conversation on WhatsApp'], insight: 'Choose the quickest route for your organisation and Mavuka will guide the next conversation.' });
  };
  const copy = async () => { if (!result) return; await navigator.clipboard?.writeText(`${result.title}\n${result.intro}\n${result.summary}`); setCopied(true); setTimeout(()=>setCopied(false), 1600); };
  const submitFollowUp = () => { if (!result || !followUp.trim()) return; const nextQuestion = followUp.trim(); setFollowUp(''); setFollowUpOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); submit(`Previous question: ${result.question}\nFollow-up question: ${nextQuestion}`, 'general', nextQuestion); };
  if (result) { const Icon = iconFor[result.kind]; return <main className="min-h-screen bg-[#f8f7fd] px-3 py-3 text-[#101022] sm:px-5"><section className="mx-auto max-w-[1240px] rounded-[26px] border border-[#e7e2f1] bg-white p-3 shadow-[0_12px_35px_rgba(54,38,100,.10)] sm:p-4">
    <div className="flex items-center justify-between rounded-2xl bg-[#f1edff] px-4 py-3"><div className="flex items-center gap-3 font-bold"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#5123b8]"><Icon size={21}/></span><span className="hidden sm:inline">{result.question}</span><span className="sm:hidden">Your answer</span></div><div className="flex gap-2"><button onClick={()=>setResult(null)} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm hover:bg-white"><ArrowLeft size={17}/> <span className="hidden sm:inline">Back to question pad</span></button><button onClick={()=>setResult(null)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm"><X size={17}/> Close</button></div></div>
    <AnimatePresence mode="wait"><motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.28}} className="mt-3 rounded-[22px] border border-[#ebe7f3] p-4 sm:p-5"><h1 className="text-3xl font-black tracking-[-.05em] sm:text-4xl">{result.title}</h1><p className="mt-1 max-w-4xl text-sm leading-relaxed text-[#36344d]">{result.intro}</p>
      {result.demo && <p className="mt-3 rounded-xl border border-[#d8c98b] bg-[#fff8dc] px-3 py-2 text-xs text-[#53491f]">Demonstration environment: this response contains illustrative information that will be replaced with Mavuka-approved details.</p>}<div className="mt-3 rounded-2xl border border-[#e8e3f0] bg-[#fbfaff] p-3"><div className="flex gap-3"><span className="text-[#5123b8]"><FileText size={21}/></span><div><h2 className="text-lg font-extrabold">Summary</h2><p className="mt-1 text-sm leading-relaxed text-[#303046]">{result.summary}</p></div></div></div>
      <ResourceLinks resources={resources}/>
      {actionNiche && <ActionChoices niche={actionNiche}/>} 
      <AnswerFeedback question={result.question}/>
      <div className="mt-3 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-[#e8e3f0] p-3"><h2 className="flex gap-2 text-lg font-extrabold"><Menu size={20} className="text-[#5123b8]"/> Key Points</h2><ul className="mt-2 space-y-2">{result.points.map(p=><li key={p} className="flex gap-2 text-sm text-[#303046]"><Check className="mt-0.5 shrink-0 rounded-full bg-[#5427bd] p-1 text-white" size={16}/>{p}</li>)}</ul></div><div className="relative overflow-hidden rounded-2xl bg-[#f0eaff] p-3"><h2 className="flex gap-2 text-lg font-extrabold"><Sparkles size={20} className="text-[#5123b8]"/> Key Insight</h2><p className="mt-2 max-w-md text-sm leading-relaxed text-[#303046]">{result.insight}</p><div className="absolute -bottom-10 -right-6 h-24 w-64 rotate-[-8deg] rounded-[50%] bg-[#bd9cff]/40"/></div></div>
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#e8e3f0] p-4 sm:flex-row sm:items-center"><div className="mr-auto flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f0eaff] text-[#5123b8]"><Wand2/></span><div><b>Next Actions</b><p className="text-sm text-[#56546a]">Refine, explore further, or copy the result.</p></div></div><button onClick={()=>setResult(resultFor(`${result.question} — refined for clarity`, result.kind))} className="action"><Wand2 size={17}/>Refine answer</button><button onClick={()=>setResult(null)} className="action"><MessageSquare size={17}/>Ask follow-up</button><button onClick={copy} className="action"><Copy size={17}/>{copied?'Copied!':'Copy result'}</button></div>
      <div className="mt-3 sm:hidden"><SpeakToHuman context={`I would like to discuss: ${result.question}`}/></div>
    </motion.div></AnimatePresence></section>{followUpOpen && <FollowUpModal value={followUp} onChange={setFollowUp} onClose={()=>setFollowUpOpen(false)} onSubmit={submitFollowUp}/>}<SpeakToHuman context={`I have a question about: ${result.question}`} floating/></main> }
  return <main className="min-h-screen bg-[#f8f7fd] p-3 sm:p-8"><section className={`relative mx-auto grid min-h-[620px] max-w-[1240px] overflow-hidden rounded-[26px] border border-[#e4e0ed] bg-white shadow-[0_12px_35px_rgba(54,38,100,.10)] ${sidebarCollapsed?'lg:grid-cols-[76px_1fr]':'lg:grid-cols-[205px_1fr]'}`}><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_35%,rgba(217,205,255,.58),transparent_28%),radial-gradient(ellipse_at_20%_100%,rgba(218,204,255,.7),transparent_19%)]"/>
    <aside className={`relative z-10 hidden border-r border-[#e8e5ee] bg-white/55 p-3 lg:block ${sidebarCollapsed?'':'p-4'}`}><div className={`mb-7 flex items-start ${sidebarCollapsed?'justify-center':'justify-between'}`}><a href="/" aria-label="Mavuka People Advisory home" className={sidebarCollapsed?'hidden':'block'}><img src="/branding/mavuka-logo-transparent.png" alt="Mavuka People Advisory" className="h-auto w-[132px]"/></a><button onClick={()=>setSidebarCollapsed(!sidebarCollapsed)} aria-label={sidebarCollapsed?'Expand sidebar':'Collapse sidebar'} className="grid h-9 w-9 place-items-center rounded-lg border border-[#ded9d0] bg-white text-[#4d5a28] hover:bg-[#f0ece4]">{sidebarCollapsed?<PanelLeftOpen size={18}/>:<PanelLeftClose size={18}/>}</button></div><nav className="space-y-1">{siteConfig.navigation.map((item,i)=>{const I=navIcons[item.type==='category'?1:i===3?3:i===4?6:0]; return <a title={sidebarCollapsed?item.label:undefined} href={item.type==='articles'?'/articles':item.type==='contact'?'/contact':'#'} onClick={e=>{if(item.type==='category'||item.type==='home'){e.preventDefault();setActiveTab(item.label);setActiveNiche(item.type==='category'?item.label:null)}}} key={item.label} className={`flex items-center rounded-xl py-3 text-sm font-semibold ${sidebarCollapsed?'justify-center px-2':'gap-3 px-4'} ${activeTab===item.label?'bg-[#e8e4dc] text-[#252525]':'hover:bg-[#f5f0e8]'}`}><I size={19}/><span className={sidebarCollapsed?'sr-only':''}>{item.label}</span></a>})}</nav></aside>
    <div className="relative z-10 flex flex-col px-4 pb-7 pt-5 sm:px-8"><header className="flex items-center justify-between"><a href="/" aria-label="Mavuka People Advisory home" className="lg:hidden"><img src="/branding/mavuka-logo-transparent.png" alt="Mavuka People Advisory" className="h-auto w-24"/></a><div className="h-10"/></header>
      <div className="pointer-events-none absolute inset-x-4 top-[15px] z-20 text-center sm:inset-x-8"><h1 className="text-4xl font-black tracking-[-.06em] sm:text-5xl lg:text-[53px]">{siteConfig.hero.title}</h1><p className="mx-auto mt-3 min-h-[52px] max-w-3xl text-[14px] leading-relaxed text-[#4d4a62] sm:text-[16px]">{showHeroSubtitle && siteConfig.hero.subtitle}</p></div>
      <div className={`mx-auto flex w-full max-w-[920px] flex-1 flex-col transition-[padding] duration-500 ease-out ${showHeroSubtitle ? 'pt-[145px]' : 'pt-[80px]'}`}>
      <div className="[&>div:first-child]:!mt-0">
      <div className="relative mt-[-198px] flex items-center gap-3 rounded-2xl border border-[#e1ddec] bg-white px-4 py-2 shadow-[0_5px_16px_rgba(41,24,83,.11)]"><Plus className="shrink-0"/><input aria-label="Ask a question" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="" className="min-w-0 flex-1 bg-transparent px-2 py-2 outline-none placeholder:text-[#5c596b]"/>{!query && <span className="pointer-events-none absolute left-[60px] animate-pulse text-sm text-[#4d5a28]">Ask a question or select a service below ↓</span>}{query && <button aria-label="Clear question text" onClick={()=>setQuery('')} className="shrink-0 rounded-md border border-[#ded9d0] bg-white px-2 py-1 text-[10px] font-bold text-[#4d5a28] transition hover:bg-[#f0ece4]">Clear text</button>}<button aria-label="Send question" onClick={()=>submit()} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#5422bb] text-white shadow-md"><Send size={21}/></button></div>
      {activeTab !== 'Quick Info & Action' && <PillMorphTabs items={siteConfig.niches} value={activeNiche} onValueChange={setActiveNiche} collapseToLeft onClose={()=>setActiveNiche(null)}/>}
      </div>
      {activeTab==='Quick Info & Action' ? <div className="mt-8"><div className="grid overflow-hidden rounded-2xl border border-[#ded9d0] bg-white sm:grid-cols-[1.04fr_.96fr]"><section className="p-4 sm:border-r sm:border-[#ded9d0]"><div className="flex items-center gap-2"><MessageSquare size={16} className="text-[#4d5a28]"/><h2 className="font-bold text-[#252525]">Quick Info</h2></div><p className="mt-2 text-xs text-[#4f4c61]">Ask a question about any topic.</p><div className="mt-3 space-y-3">{[['Products','Courses, training, seminars','Ask about a course or training programme...',Package],['Pricing','Fees, packages, quotations','Ask about pricing or packages...',CircleDollarSign],['Availability','Upcoming dates and open slots','Ask about dates or availability...',CalendarDays]].map(([title,detail,placeholder,Icon])=>{const I=Icon as typeof Package;return <div key={title as string} className="rounded-xl border border-[#e3ded5] p-3"><div className="flex items-center gap-2"><I size={15} className="text-[#4d5a28]"/><b className="text-sm">{title as string}</b></div><p className="ml-6 text-[10px] text-[#6b6b6b]">{detail as string}</p><div className="mt-2 flex overflow-hidden rounded-lg border border-[#ded9d0]"><input aria-label={title as string} placeholder={placeholder as string} className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-xs outline-none" onKeyDown={e=>{if(e.key==='Enter')submit((e.target as HTMLInputElement).value)}}/><button aria-label={`Ask about ${title as string}`} onClick={e=>submit((e.currentTarget.previousElementSibling as HTMLInputElement).value)} className="grid w-9 place-items-center bg-[#e8e4dc] text-[#4d5a28]"><Send size={13}/></button></div></div>})}</div></section><section className="border-t border-[#ded9d0] p-4 sm:border-t-0"><div className="flex items-center gap-2"><Sparkles size={16} className="text-[#4d5a28]"/><h2 className="font-bold text-[#252525]">Take Action</h2></div><p className="mt-2 text-xs text-[#4f4c61]">Ready? Choose your next step.</p><div className="mt-3 space-y-3">{[['Book a Demo','Schedule a consultation','/contact?type=demo',CalendarDays],['Request a Quote','Get a tailored proposal','/contact?type=quote',FileText],['Call Now','Speak with our team','tel:+27722963758',Phone],['WhatsApp','Start a conversation','https://wa.me/27722963758',MessageCircle]].map(([title,detail,href,Icon])=>{const I=Icon as typeof Phone;return <a key={title as string} href={href as string} className="group flex items-center justify-between rounded-xl border border-[#e3ded5] p-3 transition hover:border-[#8a9e4a]"><span className="flex items-center gap-3"><I size={16} className="text-[#4d5a28]"/><span><b className="block text-sm">{title as string}</b><span className="text-[10px] text-[#6b6b6b]">{detail as string}</span></span></span><ArrowUpRight size={16} className="text-[#6b6b6b]"/></a>})}</div></section></div></div> : <div className="mt-8 grid gap-3 sm:grid-cols-2">{(activeTab==='Why Mavuka?' ? [{title:'Our Expertise',description:'Ask about Mavuka’s executive-led people and organisation advisory.',question:'What experience and expertise does Mavuka People Advisory bring?',type:'summary'},{title:'Our Approach',description:'Understand Mavuka’s people, operating model and culture focus.',question:'What is Mavuka’s approach to human capital advisory?',type:'analysis'}] : activeTab==='Find the Right Solution' ? [{title:'People Challenge',description:'Describe your people or HR challenge.',question:'I need support with a people or HR challenge.',type:'summary'},{title:'Business Change',description:'Explore organisational change and transformation.',question:'I need support with organisational change.',type:'analysis'},{title:'Technology Change',description:'Ask about workforce readiness and adoption.',question:'I need support preparing people for technology change.',type:'general'}] : cardList).map((card)=>{const I=iconFor[card.type];return <motion.button key={card.title} onClick={()=>submit(card.question,card.type)} whileHover={{scale:1.02}} whileTap={{scale:.98}} className="group flex min-h-14 items-start gap-2 rounded-lg border border-[#e5e1ec] bg-white p-2.5 text-left shadow-sm transition-shadow hover:shadow-md"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#f0ece4] text-[#4d5a28]"><I size={15}/></span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><h2 className="text-sm font-bold text-[#252525]">{card.title}</h2><ArrowUpRight className="mt-0.5 shrink-0 text-[#6b6b6b] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={15}/></span><p className="mt-0.5 text-xs leading-snug text-[#4f4c61]">{card.description}</p></span></motion.button>})}</div>}
        {activeTab === 'Home' && activeNiche && <ServiceContextCards niche={activeNiche} onAsk={(question) => submit(question)} onTakeAction={showActionChoices}/>}
        {activeTab === 'Home' && activeNiche && <PillMorphTabs items={siteConfig.niches} labels={['Fractional HC', 'People & Culture', 'HR Function', 'Organisational Design', 'Recruitment', 'HR Practice']} value={activeNiche} onValueChange={setActiveNiche} layoutId="mavuka-niche-pill-bottom" className="mt-[52px]"/>}
        </div></div>
  </section><SpeakToHuman floating/></main>;
}
