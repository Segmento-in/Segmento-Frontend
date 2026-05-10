$base = "C:\Users\HP\Desktop\Segmento-website-dev\Segmento-Frontend\apps\sense"
$files = @(
  "$base\components\model-lab\tabs\UploadScanTab.tsx",
  "$base\components\model-lab\tabs\DocumentViewTab.tsx",
  "$base\components\model-lab\tabs\MetricsTab.tsx",
  "$base\components\model-lab\tabs\FailuresTab.tsx",
  "$base\components\model-lab\tabs\CompareTab.tsx"
)

# [pattern, replacement] pairs - ordered from most specific to least
$replacements = @(
  @('bg-\[#0F1629\]',               'bg-white shadow-sm border-slate-100'),
  @('bg-\[#0B0F1A\]',               'bg-slate-50'),
  @('border-white\/\[0\.03\]',       'border-slate-100'),
  @('border-white\/\[0\.02\]',       'border-slate-100'),
  @('border-white\/5',               'border-slate-200'),
  @('border-white\/10',              'border-slate-200'),
  @('border-white\/20',              'border-slate-300'),
  @('bg-white\/\[0\.02\]',           'bg-slate-50'),
  @('bg-white\/\[0\.04\]',           'bg-slate-100'),
  @('bg-white\/5',                   'bg-slate-100'),
  @('hover:bg-white\/10',            'hover:bg-slate-100'),
  @('hover:bg-white\/\[0\.02\]',     'hover:bg-slate-50'),
  @('hover:border-white\/20',        'hover:border-slate-300'),
  @('text-slate-600',                'text-slate-400'),
  @('text-slate-500(?!\d)',          'text-slate-400'),
  @('text-slate-400(?!\d)',          'text-slate-500'),
  @('text-slate-300',                'text-slate-700'),
  @('"text-white"',                  '"text-slate-900"'),
  @("'text-white'",                  "'text-slate-900'"),
  @('text-white font-',              'text-slate-900 font-'),
  @('bg-emerald-500\/8',             'bg-emerald-50'),
  @('bg-emerald-500\/5',             'bg-emerald-50'),
  @('bg-emerald-500\/15',            'bg-emerald-100'),
  @('bg-emerald-500\/25',            'bg-emerald-200'),
  @('border-emerald-500\/20',        'border-emerald-200'),
  @('border-emerald-500\/40',        'border-emerald-300'),
  @('border-emerald-500\/50',        'border-emerald-300'),
  @('bg-emerald-600\/80',            'bg-emerald-500'),
  @('hover:bg-emerald-600',          'hover:bg-emerald-600'),
  @('bg-red-500\/5',                 'bg-red-50'),
  @('bg-red-500\/10',                'bg-red-50'),
  @('border-red-500\/20',            'border-red-200'),
  @('border-red-500\/30',            'border-red-200'),
  @('bg-orange-500\/5',              'bg-orange-50'),
  @('border-orange-500\/20',         'border-orange-200'),
  @('bg-blue-500\/5',                'bg-blue-50'),
  @('border-blue-500\/20',           'border-blue-200'),
  @('bg-purple-500\/5',              'bg-purple-50'),
  @('border-purple-500\/20',         'border-purple-200'),
  @('bg-amber-500\/5',               'bg-amber-50'),
  @('border-amber-500\/20',          'border-amber-200'),
  @('bg-yellow-500\/20',             'bg-yellow-50'),
  @('text-yellow-300',               'text-yellow-600'),
  @('text-orange-300',               'text-orange-600'),
  @('text-red-300',                  'text-red-600'),
  @('text-blue-300',                 'text-blue-600'),
  @('text-purple-300',               'text-purple-600'),
  @('text-amber-300',                'text-amber-600'),
  @('text-emerald-300',              'text-emerald-700'),
  @('bg-orange-500\/20',             'bg-orange-100'),
  @('bg-red-500\/20',                'bg-red-100'),
  @('bg-emerald-500\/20',            'bg-emerald-100'),
  @('bg-blue-500\/20',               'bg-blue-100'),
  @('bg-amber-500\/20',              'bg-amber-100'),
  @('bg-emerald-600(?!\/)(?!\s*h)',   'bg-emerald-500'),
  @('gridcolor.*1e293b',             "gridcolor: '#e2e8f0'"),
  @('#1e293b',                        '#e2e8f0'),
  @('#334155',                        '#64748b'),
  @('#94a3b8',                        '#475569')
)

foreach ($file in $files) {
  if (-not (Test-Path $file)) { Write-Host "SKIP (not found): $file"; continue }
  $content = Get-Content $file -Raw
  foreach ($pair in $replacements) {
    $content = $content -replace $pair[0], $pair[1]
  }
  Set-Content -Path $file -Value $content -NoNewline
  Write-Host "DONE: $(Split-Path $file -Leaf)"
}

Write-Host "All light-mode token replacements complete."
