import { X } from 'lucide-react';
import { motion } from 'motion/react';

type PillMorphTabsProps = {
  items: readonly string[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  layoutId?: string;
  labels?: readonly string[];
  className?: string;
  collapseToLeft?: boolean;
  onClose?: () => void;
};

export default function PillMorphTabs({ items, value, onValueChange, layoutId = 'mavuka-niche-pill', labels, className = '', collapseToLeft = false, onClose }: PillMorphTabsProps) {
  const entries = items.map((item, index) => ({ item, label: labels?.[index] ?? item }));
  const collapsed = collapseToLeft && Boolean(value);
  const visibleEntries = collapsed && value ? [entries.find(({ item }) => item === value)!] : entries;
  return <div className={`mt-2 flex ${collapsed ? 'justify-start' : 'justify-center'} ${className}`}><div className={`inline-flex max-w-full items-center gap-0.5 rounded-lg border border-[#ded9d0] bg-[#f0ece4]/80 p-0.5 shadow-sm ${collapsed ? '' : 'flex-wrap justify-center sm:flex-nowrap'}`}>{visibleEntries.map(({ item, label }) => {
    const active = value === item;
    return <button key={item} onClick={() => onValueChange(value === item ? null : item)} className="relative rounded-md px-2 py-1 text-[10px] font-semibold text-[#4f4c61] transition sm:px-2 sm:text-[11px]">{active && <motion.span layoutId={layoutId} className="absolute inset-0 rounded-md bg-[#4d5a28] shadow-[0_2px_7px_rgba(37,37,37,.16)]" transition={{ type: 'spring', stiffness: 380, damping: 30 }}/>}<span className={`relative z-10 ${active ? 'text-white' : 'hover:text-[#252525]'}`}>{label}</span></button>;
  })}{collapsed && <button type="button" aria-label="Show all services" onClick={() => (onClose ? onClose() : onValueChange(null))} className="grid h-6 w-6 place-items-center rounded-md text-[#4f4c61] transition hover:bg-white hover:text-[#252525]"><X size={14}/></button>}</div></div>;
}
