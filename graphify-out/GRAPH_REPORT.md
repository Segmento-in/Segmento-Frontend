# Graph Report - Segmento-Frontend  (2026-06-24)

## Corpus Check
- 188 files · ~1,537,094 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1101 nodes · 1475 edges · 99 communities (81 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `09f8565a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 93|Community 93]]

## God Nodes (most connected - your core abstractions)
1. `APIClient` - 73 edges
2. `AnalysisResponse` - 30 edges
3. `getApiBase()` - 20 edges
4. `ModelLabState` - 18 edges
5. `EvaluatorModel` - 18 edges
6. `compilerOptions` - 16 edges
7. `compilerOptions` - 16 edges
8. `compilerOptions` - 16 edges
9. `Segmento Main-Site — Upgraded Content Blueprint v2.0` - 16 edges
10. `fetchNewsByCategory()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Page()` --calls--> `fetchNewsByCategory()`  [INFERRED]
  apps/pulse/app/page.tsx → apps/pulse/lib/newsApi.ts
- `FileScanResult` --references--> `AnalysisResponse`  [EXTRACTED]
  apps/sense/components/model-lab/tabs/AzureScanTab.tsx → apps/sense/lib/apiClient.ts
- `TableScanEntry` --references--> `AnalysisResponse`  [EXTRACTED]
  apps/sense/components/model-lab/tabs/DatabaseScanTab.tsx → apps/sense/lib/apiClient.ts
- `Props` --references--> `EvaluatorModel`  [EXTRACTED]
  apps/sense/components/model-lab/tabs/DriveScanTab.tsx → apps/sense/lib/apiClient.ts
- `Props` --references--> `EvaluatorModel`  [EXTRACTED]
  apps/sense/components/model-lab/tabs/GCSScanTab.tsx → apps/sense/lib/apiClient.ts

## Import Cycles
- 3-file cycle: `apps/sense/app/model-lab/ModelLabClient.tsx -> apps/sense/components/model-lab/ModelLabTabs.tsx -> apps/sense/components/model-lab/tabs/DocumentViewTab.tsx -> apps/sense/app/model-lab/ModelLabClient.tsx`
- 3-file cycle: `apps/sense/app/model-lab/ModelLabClient.tsx -> apps/sense/components/model-lab/ModelLabTabs.tsx -> apps/sense/components/model-lab/tabs/FailuresTab.tsx -> apps/sense/app/model-lab/ModelLabClient.tsx`
- 3-file cycle: `apps/sense/app/model-lab/ModelLabClient.tsx -> apps/sense/components/model-lab/ModelLabTabs.tsx -> apps/sense/components/model-lab/tabs/CompareTab.tsx -> apps/sense/app/model-lab/ModelLabClient.tsx`
- 3-file cycle: `apps/sense/app/model-lab/ModelLabClient.tsx -> apps/sense/components/model-lab/ModelLabTabs.tsx -> apps/sense/components/model-lab/tabs/MetricsTab.tsx -> apps/sense/app/model-lab/ModelLabClient.tsx`
- 3-file cycle: `apps/sense/app/model-lab/ModelLabClient.tsx -> apps/sense/components/model-lab/ModelLabTabs.tsx -> apps/sense/components/model-lab/tabs/UploadScanTab.tsx -> apps/sense/app/model-lab/ModelLabClient.tsx`

## Communities (99 total, 18 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (30): AIEngineTeaser(), LAYER_BADGES, CounterSection(), DocumentFeatures(), features, cardVariants, containerVariants, enterpriseFeatures (+22 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (24): BatchEvalResponse, EvaluatorParseResponse, EvaluatorPrediction, EvaluatorScanResponse, GTSpan, MetricRow, PinnedResult, DEFAULT_STATE (+16 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (43): dependencies, class-variance-authority, clsx, date-fns, firebase, framer-motion, lucide-react, next (+35 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (16): fadeUp(), Features(), fadeUp(), Hero(), PID, PRODUCTS, CollectShell(), PulseShell() (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (27): useAutoRefresh(), UseAutoRefreshOptions, UseAutoRefreshResult, ConnectorResultDetail, ConnectorResultRow, DriveFileScanResult, DriveItem, FileCatalogEntry (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (36): dependencies, class-variance-authority, clsx, framer-motion, lucide-react, next, plotly.js-dist-min, @radix-ui/react-accordion (+28 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (22): AIEngineCTA(), AIEngineHero(), INDUSTRY_CATEGORIES, IndustryContext(), ModelCardGrid(), TAB_LAYERS, FILTER_BUTTONS, FilterKey (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (15): director, milestones, team, openRoles, footerLinks, socialLinks, MegaFeatured, MegaItem (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (21): VideoJobStatus, ACC_COLOR(), getPiiColor(), ModelCard(), ModelInfo, ModelShowdownResult, PiiBadge(), Prediction (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (25): dependencies, framer-motion, lucide-react, next, next-themes, node-appwrite, react, react-dom (+17 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (15): CloudStorageConnector(), ConfluenceConnector(), ConfluenceConnectorProps, GmailConnector(), GmailConnectorProps, SlackConnector(), SlackConnectorProps, Pattern (+7 more)

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+13 more)

### Community 13 - "Community 13"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 15 - "Community 15"
Cohesion: 0.15
Nodes (13): Page(), LatestArticlesPage(), TAGS, fetchNewsByCategory(), CATEGORY_UI_METADATA, CategoryPage(), categoryRelationships, CategoryUI (+5 more)

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (6): BG_MAP, CardSceneProps, CardSceneVariant, SCENE_MAP, CardSceneDynamic, HeroSceneDynamic

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (13): CommentSectionProps, addComment(), Comment, fetchWithTimeout(), getArticleStats(), getArticleViewCount(), getTrendingArticles(), statsCache (+5 more)

### Community 18 - "Community 18"
Cohesion: 0.13
Nodes (11): EvaluatorModel, FileScanResult, Props, Step, Props, Props, AWS_REGIONS, FileScanResult (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.12
Nodes (16): dependencies, class-variance-authority, clsx, lucide-react, @radix-ui/react-accordion, @radix-ui/react-dialog, @radix-ui/react-slot, @radix-ui/react-tabs (+8 more)

### Community 20 - "Community 20"
Cohesion: 0.14
Nodes (9): playfair, inter, metadata, SenseNavbar(), ICONS, STYLES, Toast, ToastPayload (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (11): metadata, CATEGORY_META, DEFAULT_SELECTED, SenseComparisonTable(), SenseComparisonTableProps, COMPARISON_DATA, ComparisonCategory, ComparisonRow (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.23
Nodes (11): AzureBlobConnector(), AzureBlobConnectorProps, CloudStorageConnectorProps, GCSConnector(), GCSConnectorProps, GoogleDriveConnector(), GoogleDriveConnectorProps, S3Connector() (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.13
Nodes (14): dependencies, firebase, description, devDependencies, prettier, name, private, scripts (+6 more)

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (8): NewsletterCardProps, ALL_PREFERENCES, getTheme(), NEWSLETTER_THEMES, NewsletterTheme, PreferenceKey, NewsletterHub(), NewsletterModalProps

### Community 25 - "Community 25"
Cohesion: 0.16
Nodes (11): HeroSection(), NewsletterCTA(), BASE_STYLES, PrimaryActionButton, PrimaryActionButtonProps, SIZE_STYLES, aestheticColors, DEFAULT_TOPIC_SECTIONS (+3 more)

### Community 26 - "Community 26"
Cohesion: 0.15
Nodes (11): BatchDocResult, CatalogResponse, DriveFolderScanResponse, DriveTagResult, ModelInfo, ModelScanResult, PIIMatch, ALWAYS_ON_DEFAULTS (+3 more)

### Community 27 - "Community 27"
Cohesion: 0.19
Nodes (6): ArticleInteraction(), ArticleInteractionProps, EngagementStats, useEngagement(), UseEngagementReturn, generateArticleId()

### Community 28 - "Community 28"
Cohesion: 0.20
Nodes (8): PIICount, SchemaInfo, COLORS, PIIAnalytics(), PIIAnalyticsProps, FileScanResult, Props, Step

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (6): SelectContentProps, SelectContext, SelectItemProps, SelectProps, SelectTriggerProps, SelectValueProps

### Community 30 - "Community 30"
Cohesion: 0.22
Nodes (6): AudioPlayerProps, AudioSummaryButtonProps, CATCHY_MESSAGES, FloatingNote, MUSIC_EMOJIS, cn()

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (5): NEWSLETTER_TYPES, SubscriptionManagerProps, pulseFirebaseConfig, fetchUserSubscription(), UserSubscription

### Community 32 - "Community 32"
Cohesion: 0.18
Nodes (6): Connector, ConnectorId, CONNECTORS, FALLBACK_CATALOGUE, FlowState, metadata

### Community 33 - "Community 33"
Cohesion: 0.24
Nodes (9): aestheticColors, ArticlesByTopic(), TOPICS, Article, CategoryBadge(), CategoryBadgeProps, DOT_PALETTE, getDotColor() (+1 more)

### Community 34 - "Community 34"
Cohesion: 0.18
Nodes (6): aestheticColors, CENTER_BOTTOM, CENTER_FEATURED, HeroSectionProps, LEFT_CARDS, RIGHT_LIST

### Community 35 - "Community 35"
Cohesion: 0.18
Nodes (5): DatabaseCredentials, DB_DEFAULTS, DbType, Step, TableScanEntry

### Community 36 - "Community 36"
Cohesion: 0.18
Nodes (10): COMPLETE SECTION ORDER (Final), Design Notes, DESIGN TOKENS (Non-negotiable), DRIBBBLE / MOBBIN MASTER SEARCH LIST, FULL PAGE FLOW, KEY DESIGN RULES (Locked), NAVBAR, Products Dropdown (+2 more)

### Community 37 - "Community 37"
Cohesion: 0.27
Nodes (5): metadata, Message, dmMono, monaSans, syne

### Community 39 - "Community 39"
Cohesion: 0.20
Nodes (4): ArticleDetailViewProps, TimeDisplayProps, ViewCounterProps, incrementArticleView()

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (4): PulseLogo(), CATEGORIES, MAIN_NAV, NavBar()

### Community 41 - "Community 41"
Cohesion: 0.22
Nodes (9): BENTO GRID LAYOUT, HERO TILE — 100% Client-Side Processing, MEDIUM TILE — Explainable AI, SECTION 3 — FEATURES ("Why Segmento?"), Section Heading, Section Label (pill tag), Section Subtext, SMALL TILE — Zero-Trust Data Handling (+1 more)

### Community 42 - "Community 42"
Cohesion: 0.22
Nodes (9): Product 1 — Segmento Pulse *(Left text / Right visual)*, Product 2 — Segmento Sense *(Right text / Left visual — alternates)*, Product 3 — Segmento Collect *(Left text / Right visual)*, Product 4 — Segmento Resolve *(Right text / Left visual — alternates)*, Product 5 — Segmento SprintQL *(Left text / Right visual)*, SECTION 6 — PRODUCT SHOWCASE, Section Heading, Section Label (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.22
Nodes (3): SliderProps, Textarea, TooltipProps

### Community 44 - "Community 44"
Cohesion: 0.33
Nodes (8): AuthorMetaBlock(), AuthorMetaBlockProps, AVATAR_BG_PALETTE, formatDate(), getAvatarBg(), getInitials(), InitialsAvatar(), resolveAuthorName()

### Community 45 - "Community 45"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 46 - "Community 46"
Cohesion: 0.25
Nodes (8): Announcement Badge (pill above headline), H1 Headline, Hero Visual — RIGHT SIDE (Critical), Primary CTA Button, Secondary CTA Button, SECTION 1 — HERO, Subheadline, Trust Line (small text below buttons)

### Community 47 - "Community 47"
Cohesion: 0.25
Nodes (8): Column: Company, Column: Compliance, Column: Legal, Column: Products, Compliance badges row (bottom of footer), Copyright line, SECTION 9 — FOOTER, Tagline under logo

### Community 48 - "Community 48"
Cohesion: 0.25
Nodes (8): Layout, SECTION 5 — HOW IT WORKS, Section Heading, Section Label (pill tag), Section Subtext, Step 1 — CONNECT, Step 2 — DETECT, Step 3 — CONTROL

### Community 49 - "Community 49"
Cohesion: 0.38
Nodes (6): fetchResearchPaperById(), _fetchSingleCategory(), getDeterministicVariant(), sanitizeArticlePayload(), TaxonomyMatrix, UMBRELLA_CATEGORIES

### Community 50 - "Community 50"
Cohesion: 0.29
Nodes (7): Heading, Layout, Primary Button, Secondary Button, SECTION 8 — CTA SECTION, Subtext, Trust micro-line (below buttons)

### Community 52 - "Community 52"
Cohesion: 0.48
Nodes (6): BACKEND_URL, DELETE(), GET(), POST(), proxyRequest(), PUT()

### Community 53 - "Community 53"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 54 - "Community 54"
Cohesion: 0.29
Nodes (4): DialogContent, DialogDescription, DialogOverlay, DialogTitle

### Community 55 - "Community 55"
Cohesion: 0.40
Nodes (4): InspectorResult, Inspector(), InspectorProps, PALETTE

### Community 56 - "Community 56"
Cohesion: 0.33
Nodes (6): Caption text (small, centered below), Layout, Left Side — Compliance Badges (monochromatic icons), Right Side — Ecosystem Logos (grayed out, monochrome), SECTION 2 — TRUST STRIP, Separator

### Community 57 - "Community 57"
Cohesion: 0.33
Nodes (5): 🏗️ Architecture Stack, 🪐 Ecosystem, 🚀 Getting Started, Local Development, Prerequisites

### Community 58 - "Community 58"
Cohesion: 0.33
Nodes (5): main, name, private, types, version

### Community 59 - "Community 59"
Cohesion: 0.60
Nodes (3): ContactFormData, POST(), getAppwriteClient()

### Community 60 - "Community 60"
Cohesion: 0.40
Nodes (5): Caption (centered, below marquee), Layout, Logos to include, SECTION 7 — ECOSYSTEM STRIP, Section Label

### Community 64 - "Community 64"
Cohesion: 0.50
Nodes (3): DatabaseConnector(), DatabaseConnectorProps, DatabaseCredentials

### Community 65 - "Community 65"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 66 - "Community 66"
Cohesion: 0.50
Nodes (3): Button, ButtonProps, buttonVariants

### Community 67 - "Community 67"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

## Knowledge Gaps
- **470 isolated node(s):** `director`, `team`, `milestones`, `ContactFormData`, `openRoles` (+465 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `APIClient` connect `Community 1` to `Community 32`, `Community 64`, `Community 2`, `Community 35`, `Community 5`, `Community 9`, `Community 11`, `Community 18`, `Community 22`, `Community 26`, `Community 28`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `getApiBase()` connect `Community 17` to `Community 0`, `Community 39`, `Community 15`, `Community 49`, `Community 24`, `Community 27`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `director`, `team`, `milestones` to the rest of the system?**
  _470 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.050314465408805034 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0746606334841629 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05877551020408163 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._