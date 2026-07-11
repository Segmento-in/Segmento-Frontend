import React from 'react';

// ── Generic fallback icon ────────────────────────────────────────────────────
const GenericFileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

// ── Branded — PDF (Red) ──────────────────────────────────────────────────────
const PdfIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    {/* PDF curl indicator — small triangle at bottom-left */}
    <path d="M8 17 L8 14 Q8 13 9 13 Q10 13 10 14 Q10 15.5 9 15.5 L8 15.5" strokeWidth={1.3} />
    <path d="M12 13 L12 17" strokeWidth={1.3} />
    <path d="M12 13 Q14 13 14 15 Q14 17 12 17" strokeWidth={1.3} />
  </svg>
);

// ── Branded — Word/docx (Blue) ──────────────────────────────────────────────
const DocxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    {/* W-shape text motif */}
    <polyline points="7.5 13 9 18 11 14.5 13 18 14.5 13" strokeWidth={1.3} />
  </svg>
);

// ── Branded — Excel/xlsx, xls (Green) ──────────────────────────────────────
const XlsxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    {/* X grid motif */}
    <line x1="8" y1="13" x2="12" y2="18" strokeWidth={1.3} />
    <line x1="12" y1="13" x2="8" y2="18" strokeWidth={1.3} />
    <line x1="13.5" y1="13" x2="16.5" y2="13" strokeWidth={1.3} />
    <line x1="13.5" y1="15.5" x2="16.5" y2="15.5" strokeWidth={1.3} />
    <line x1="13.5" y1="18" x2="16.5" y2="18" strokeWidth={1.3} />
  </svg>
);

// ── Branded — PowerPoint/pptx (Orange) ─────────────────────────────────────
const PptxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    {/* Small slide/projector motif */}
    <rect x="7.5" y="13" width="9" height="6" rx="1" strokeWidth={1.3} />
    <line x1="12" y1="13" x2="12" y2="12" strokeWidth={1.3} />
    <line x1="10" y1="12" x2="14" y2="12" strokeWidth={1.3} />
  </svg>
);

// ── Video family (Violet) ────────────────────────────────────────────────────
const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    {/* Play triangle */}
    <polygon points="9 13 9 18 15 15.5" strokeWidth={1.3} />
  </svg>
);

// ── Plain-document family (Slate) ────────────────────────────────────────────
const PlainDocIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    {/* Simple text lines */}
    <line x1="8" y1="13" x2="16" y2="13" strokeWidth={1.3} />
    <line x1="8" y1="16" x2="16" y2="16" strokeWidth={1.3} />
    <line x1="8" y1="19" x2="13" y2="19" strokeWidth={1.3} />
  </svg>
);

// ── Markup & data family (Amber) ─────────────────────────────────────────────
const MarkupIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    {/* Angle-bracket motif */}
    <polyline points="8 13.5 6 15.5 8 17.5" strokeWidth={1.3} />
    <polyline points="16 13.5 18 15.5 16 17.5" strokeWidth={1.3} />
    <line x1="13" y1="13" x2="11" y2="18" strokeWidth={1.3} />
  </svg>
);

// ── Config family (Teal) ──────────────────────────────────────────────────────
const ConfigIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    {/* Horizontal config-lines motif */}
    <line x1="8" y1="13" x2="16" y2="13" strokeWidth={1.3} />
    <line x1="8" y1="15.5" x2="12" y2="15.5" strokeWidth={1.3} />
    <line x1="14" y1="15.5" x2="16" y2="15.5" strokeWidth={1.3} />
    <line x1="8" y1="18" x2="16" y2="18" strokeWidth={1.3} />
  </svg>
);

// ── Database/columnar family (Indigo) ────────────────────────────────────────
const DatabaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    {/* Stacked-cylinder motif */}
    <ellipse cx="12" cy="14.5" rx="4" ry="1.5" strokeWidth={1.3} />
    <line x1="8" y1="14.5" x2="8" y2="17.5" strokeWidth={1.3} />
    <line x1="16" y1="14.5" x2="16" y2="17.5" strokeWidth={1.3} />
    <ellipse cx="12" cy="17.5" rx="4" ry="1.5" strokeWidth={1.3} />
  </svg>
);

// ── Return type ──────────────────────────────────────────────────────────────
export interface FileTypeIconInfo {
  Icon: React.FC<{ className?: string }>;
  bgColorClass: string;
  iconColorClass: string;
  hoverBorderClass: string;
  family: string;
}

// ── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, FileTypeIconInfo> = {
  // Branded — PDF
  pdf: { Icon: PdfIcon, bgColorClass: 'bg-red-500/10', iconColorClass: 'text-red-600', hoverBorderClass: 'hover:border-red-300/60', family: 'branded-pdf' },

  // Branded — Word
  docx: { Icon: DocxIcon, bgColorClass: 'bg-blue-500/10', iconColorClass: 'text-blue-600', hoverBorderClass: 'hover:border-blue-300/60', family: 'branded-word' },

  // Branded — Excel
  xlsx: { Icon: XlsxIcon, bgColorClass: 'bg-green-500/10', iconColorClass: 'text-green-600', hoverBorderClass: 'hover:border-green-300/60', family: 'branded-excel' },
  xls:  { Icon: XlsxIcon, bgColorClass: 'bg-green-500/10', iconColorClass: 'text-green-600', hoverBorderClass: 'hover:border-green-300/60', family: 'branded-excel' },

  // Branded — PowerPoint
  pptx: { Icon: PptxIcon, bgColorClass: 'bg-orange-500/10', iconColorClass: 'text-orange-600', hoverBorderClass: 'hover:border-orange-300/60', family: 'branded-powerpoint' },

  // Video
  mp4:  { Icon: VideoIcon, bgColorClass: 'bg-violet-500/10', iconColorClass: 'text-violet-600', hoverBorderClass: 'hover:border-violet-300/60', family: 'video' },
  mkv:  { Icon: VideoIcon, bgColorClass: 'bg-violet-500/10', iconColorClass: 'text-violet-600', hoverBorderClass: 'hover:border-violet-300/60', family: 'video' },
  avi:  { Icon: VideoIcon, bgColorClass: 'bg-violet-500/10', iconColorClass: 'text-violet-600', hoverBorderClass: 'hover:border-violet-300/60', family: 'video' },
  mov:  { Icon: VideoIcon, bgColorClass: 'bg-violet-500/10', iconColorClass: 'text-violet-600', hoverBorderClass: 'hover:border-violet-300/60', family: 'video' },
  webm: { Icon: VideoIcon, bgColorClass: 'bg-violet-500/10', iconColorClass: 'text-violet-600', hoverBorderClass: 'hover:border-violet-300/60', family: 'video' },

  // Plain-document
  txt:  { Icon: PlainDocIcon, bgColorClass: 'bg-slate-500/10', iconColorClass: 'text-slate-500', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  rtf:  { Icon: PlainDocIcon, bgColorClass: 'bg-slate-500/10', iconColorClass: 'text-slate-500', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  odt:  { Icon: PlainDocIcon, bgColorClass: 'bg-slate-500/10', iconColorClass: 'text-slate-500', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  md:   { Icon: PlainDocIcon, bgColorClass: 'bg-slate-500/10', iconColorClass: 'text-slate-500', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  log:  { Icon: PlainDocIcon, bgColorClass: 'bg-slate-500/10', iconColorClass: 'text-slate-500', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  eml:  { Icon: PlainDocIcon, bgColorClass: 'bg-slate-500/10', iconColorClass: 'text-slate-500', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  epub: { Icon: PlainDocIcon, bgColorClass: 'bg-slate-500/10', iconColorClass: 'text-slate-500', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },

  // Markup & data
  json: { Icon: MarkupIcon, bgColorClass: 'bg-amber-500/10', iconColorClass: 'text-amber-600', hoverBorderClass: 'hover:border-amber-300/60', family: 'markup-data' },
  xml:  { Icon: MarkupIcon, bgColorClass: 'bg-amber-500/10', iconColorClass: 'text-amber-600', hoverBorderClass: 'hover:border-amber-300/60', family: 'markup-data' },
  yaml: { Icon: MarkupIcon, bgColorClass: 'bg-amber-500/10', iconColorClass: 'text-amber-600', hoverBorderClass: 'hover:border-amber-300/60', family: 'markup-data' },
  html: { Icon: MarkupIcon, bgColorClass: 'bg-amber-500/10', iconColorClass: 'text-amber-600', hoverBorderClass: 'hover:border-amber-300/60', family: 'markup-data' },

  // Config (tabular-text / delimiter-separated / config)
  csv:     { Icon: ConfigIcon, bgColorClass: 'bg-teal-500/10', iconColorClass: 'text-teal-600', hoverBorderClass: 'hover:border-teal-300/60', family: 'config' },
  tsv:     { Icon: ConfigIcon, bgColorClass: 'bg-teal-500/10', iconColorClass: 'text-teal-600', hoverBorderClass: 'hover:border-teal-300/60', family: 'config' },
  ini:     { Icon: ConfigIcon, bgColorClass: 'bg-teal-500/10', iconColorClass: 'text-teal-600', hoverBorderClass: 'hover:border-teal-300/60', family: 'config' },
  toml:    { Icon: ConfigIcon, bgColorClass: 'bg-teal-500/10', iconColorClass: 'text-teal-600', hoverBorderClass: 'hover:border-teal-300/60', family: 'config' },
  config:  { Icon: ConfigIcon, bgColorClass: 'bg-teal-500/10', iconColorClass: 'text-teal-600', hoverBorderClass: 'hover:border-teal-300/60', family: 'config' },
  edifact: { Icon: ConfigIcon, bgColorClass: 'bg-teal-500/10', iconColorClass: 'text-teal-600', hoverBorderClass: 'hover:border-teal-300/60', family: 'config' },

  // Database/columnar
  sqlite:  { Icon: DatabaseIcon, bgColorClass: 'bg-indigo-500/10', iconColorClass: 'text-indigo-600', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  sql:     { Icon: DatabaseIcon, bgColorClass: 'bg-indigo-500/10', iconColorClass: 'text-indigo-600', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  parquet: { Icon: DatabaseIcon, bgColorClass: 'bg-indigo-500/10', iconColorClass: 'text-indigo-600', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  avro:    { Icon: DatabaseIcon, bgColorClass: 'bg-indigo-500/10', iconColorClass: 'text-indigo-600', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  orc:     { Icon: DatabaseIcon, bgColorClass: 'bg-indigo-500/10', iconColorClass: 'text-indigo-600', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  hdf5:    { Icon: DatabaseIcon, bgColorClass: 'bg-indigo-500/10', iconColorClass: 'text-indigo-600', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  feather: { Icon: DatabaseIcon, bgColorClass: 'bg-indigo-500/10', iconColorClass: 'text-indigo-600', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  dta:     { Icon: DatabaseIcon, bgColorClass: 'bg-indigo-500/10', iconColorClass: 'text-indigo-600', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
};

// ── Neutral fallback ─────────────────────────────────────────────────────────
const FALLBACK: FileTypeIconInfo = {
  Icon: GenericFileIcon,
  bgColorClass: 'bg-slate-100',
  iconColorClass: 'text-slate-400',
  hoverBorderClass: 'hover:border-slate-300/60',
  family: 'generic',
};

/**
 * Returns the icon component and Tailwind color classes for a given file ext.
 * Never throws; returns a neutral fallback for any unknown extension.
 */
export function getFileTypeIcon(ext: string): FileTypeIconInfo {
  return ICON_MAP[ext] ?? FALLBACK;
}
