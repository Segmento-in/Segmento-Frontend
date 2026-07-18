import React from 'react';

export interface FileTypeIconInfo {
  Icon: React.FC<{ className?: string }>;
  bgColorClass: string;
  iconColorClass: string;
  hoverBorderClass: string;
  family: string;
}

// Factory for image-based icons
// This creates a React component that renders the real logo image.
// We use a regular img tag because the logos are loaded directly from the public/icons folder,
// and the size is controlled by Tailwind classes passed in `className`.
const createIcon = (src: string, alt: string): React.FC<{ className?: string }> => {
  const IconComponent: React.FC<{ className?: string }> = ({ className }) => (
    <img src={`/sense${src}`} alt={alt} className={className} style={{ objectFit: 'contain' }} />
  );
  IconComponent.displayName = `Icon(${alt})`;
  return IconComponent;
};

// Generic / Default fallback icon
const GenericFileIcon = createIcon('/icons/txt.svg', 'File');

// ── Icon map linking file extensions to your awesome downloaded logos! ────────
const ICON_MAP: Record<string, FileTypeIconInfo> = {
  // Branded — PDF
  pdf: { Icon: createIcon('/icons/pdf.svg', 'PDF'), bgColorClass: 'bg-red-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-red-300/60', family: 'branded-pdf' },

  // Branded — Word
  docx: { Icon: createIcon('/icons/word.svg', 'Word'), bgColorClass: 'bg-blue-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-blue-300/60', family: 'branded-word' },

  // Branded — Excel
  xlsx: { Icon: createIcon('/icons/xlsx.svg', 'Excel'), bgColorClass: 'bg-green-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-green-300/60', family: 'branded-excel' },
  xls:  { Icon: createIcon('/icons/xls.svg', 'Excel Legacy'), bgColorClass: 'bg-green-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-green-300/60', family: 'branded-excel' },

  // Branded — PowerPoint
  pptx: { Icon: createIcon('/icons/ppt.svg', 'PowerPoint'), bgColorClass: 'bg-orange-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-orange-300/60', family: 'branded-powerpoint' },

  // Video
  mp4:  { Icon: createIcon('/icons/mp4.svg', 'Video'), bgColorClass: 'bg-violet-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-violet-300/60', family: 'video' },

  // Plain-document
  txt:  { Icon: createIcon('/icons/txt.svg', 'TXT'), bgColorClass: 'bg-slate-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  rtf:  { Icon: createIcon('/icons/rtf.svg', 'RTF'), bgColorClass: 'bg-slate-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  odt:  { Icon: createIcon('/icons/odt.svg', 'ODT'), bgColorClass: 'bg-slate-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  md:   { Icon: createIcon('/icons/markdown.svg', 'Markdown'), bgColorClass: 'bg-slate-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  log:  { Icon: createIcon('/icons/log.svg', 'LOG'), bgColorClass: 'bg-slate-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  eml:  { Icon: createIcon('/icons/email.svg', 'Email'), bgColorClass: 'bg-slate-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },
  epub: { Icon: createIcon('/icons/txt.svg', 'EPUB'), bgColorClass: 'bg-slate-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-slate-300/60', family: 'plain-document' },

  // Markup & data
  json: { Icon: createIcon('/icons/json.svg', 'JSON'), bgColorClass: 'bg-amber-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-amber-300/60', family: 'markup-data' },
  xml:  { Icon: createIcon('/icons/xml.svg', 'XML'), bgColorClass: 'bg-amber-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-amber-300/60', family: 'markup-data' },
  yaml: { Icon: createIcon('/icons/yaml.svg', 'YAML'), bgColorClass: 'bg-amber-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-amber-300/60', family: 'markup-data' },
  html: { Icon: createIcon('/icons/html.svg', 'HTML'), bgColorClass: 'bg-amber-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-amber-300/60', family: 'markup-data' },

  // Config (tabular-text / delimiter-separated / config)
  csv:     { Icon: createIcon('/icons/csv.svg', 'CSV'), bgColorClass: 'bg-teal-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-teal-300/60', family: 'config' },
  toml:    { Icon: createIcon('/icons/toml.svg', 'TOML'), bgColorClass: 'bg-teal-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-teal-300/60', family: 'config' },
  config:  { Icon: createIcon('/icons/config.jpg', 'Config'), bgColorClass: 'bg-teal-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-teal-300/60', family: 'config' },
  edifact: { Icon: createIcon('/icons/config.jpg', 'EDIFACT'), bgColorClass: 'bg-teal-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-teal-300/60', family: 'config' },

  // Database/columnar
  sqlite:  { Icon: createIcon('/icons/sqlite.svg', 'SQLite'), bgColorClass: 'bg-indigo-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  sql:     { Icon: createIcon('/icons/sql-script.svg', 'SQL'), bgColorClass: 'bg-indigo-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  parquet: { Icon: createIcon('/icons/parquet.png', 'Parquet'), bgColorClass: 'bg-indigo-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  avro:    { Icon: createIcon('/icons/avro.svg', 'Avro'), bgColorClass: 'bg-indigo-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  orc:     { Icon: createIcon('/icons/orc.png', 'ORC'), bgColorClass: 'bg-indigo-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  hdf5:    { Icon: createIcon('/icons/hdf5.png', 'HDF5'), bgColorClass: 'bg-indigo-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  feather: { Icon: createIcon('/icons/feather.svg', 'Feather'), bgColorClass: 'bg-indigo-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
  dta:     { Icon: createIcon('/icons/dta.svg', 'DTA'), bgColorClass: 'bg-indigo-500/10', iconColorClass: '', hoverBorderClass: 'hover:border-indigo-300/60', family: 'database-columnar' },
};

// ── Neutral fallback ─────────────────────────────────────────────────────────
const FALLBACK: FileTypeIconInfo = {
  Icon: GenericFileIcon,
  bgColorClass: 'bg-slate-100',
  iconColorClass: '',
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
