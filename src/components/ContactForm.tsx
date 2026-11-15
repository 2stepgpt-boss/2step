import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('sending');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/enquiry', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(Object.fromEntries(form)) });
    setStatus(response.ok ? 'success' : 'error');
    if (response.ok) event.currentTarget.reset();
  }
  if (status === 'success') return <div className="rounded-3xl bg-[#eee7ff] p-7"><h2 className="text-2xl font-black">Thank you.</h2><p className="mt-2 text-[#504e61]">Your consultation request has been received. Mavuka will respond using the details you provided.</p></div>;
  return <form onSubmit={submit} className="space-y-4 rounded-3xl border border-[#e6e1ed] bg-white p-6 shadow-sm"><label className="block text-sm font-bold">Name<input required name="name" maxLength={160} className="mt-1 w-full rounded-xl border border-[#ddd7e9] px-4 py-3 outline-[#5422bb]"/></label><label className="block text-sm font-bold">Email<input required type="email" name="email" maxLength={254} className="mt-1 w-full rounded-xl border border-[#ddd7e9] px-4 py-3 outline-[#5422bb]"/></label><label className="block text-sm font-bold">How can Mavuka help?<textarea required name="message" maxLength={2000} rows={5} className="mt-1 w-full rounded-xl border border-[#ddd7e9] px-4 py-3 outline-[#5422bb]"/></label><p className="text-xs text-[#625d72]">By submitting, you consent to Mavuka using these details to respond to this enquiry.</p><button disabled={status==='sending'} className="rounded-full bg-[#5422bb] px-5 py-3 font-bold text-white disabled:opacity-60">{status==='sending'?'Sending…':'Request a consultation'}</button>{status==='error' && <p className="text-sm text-red-700">Your request could not be sent. Please try again.</p>}</form>;
}
