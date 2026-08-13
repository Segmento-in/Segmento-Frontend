# Graph Report - ..  (2026-08-13)

## Corpus Check
- 204 files · ~1,503,539 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1162 nodes · 1763 edges · 106 communities (87 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `07c67284`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_APIClient|APIClient]]
- [[_COMMUNITY_ModelLabClient.tsx|ModelLabClient.tsx]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_Hero.tsx|Hero.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_Navbar.tsx|Navbar.tsx]]
- [[_COMMUNITY_EvaluatorModel|EvaluatorModel]]
- [[_COMMUNITY_ProfileClient.tsx|ProfileClient.tsx]]
- [[_COMMUNITY_FormatScanTab.tsx|FormatScanTab.tsx]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_DocumentViewerModal.tsx|DocumentViewerModal.tsx]]
- [[_COMMUNITY_apiClient.ts|apiClient.ts]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_NewsletterHub.tsx|NewsletterHub.tsx]]
- [[_COMMUNITY_ConnectorPreviewUI.tsx|ConnectorPreviewUI.tsx]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_layout.tsx|layout.tsx]]
- [[_COMMUNITY_newsApi.ts|newsApi.ts]]
- [[_COMMUNITY_CardScene.tsx|CardScene.tsx]]
- [[_COMMUNITY_analytics.ts|analytics.ts]]
- [[_COMMUNITY_SenseComparisonTable.tsx|SenseComparisonTable.tsx]]
- [[_COMMUNITY_ConnectorsClient.tsx|ConnectorsClient.tsx]]
- [[_COMMUNITY_useAuth|useAuth]]
- [[_COMMUNITY_AnalysisResponse|AnalysisResponse]]
- [[_COMMUNITY_HomePageClient.tsx|HomePageClient.tsx]]
- [[_COMMUNITY_DriveScanTab.tsx|DriveScanTab.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_apiBase.ts|apiBase.ts]]
- [[_COMMUNITY_Segmento Main-Site — Upgraded Content Blueprint v2.0|Segmento Main-Site — Upgraded Content Blueprint v2.0]]
- [[_COMMUNITY_SubscriptionManager.tsx|SubscriptionManager.tsx]]
- [[_COMMUNITY_AudioSummaryButton.tsx|AudioSummaryButton.tsx]]
- [[_COMMUNITY_HeroSection.tsx|HeroSection.tsx]]
- [[_COMMUNITY_layout.tsx|layout.tsx]]
- [[_COMMUNITY_CategoryPage.tsx|CategoryPage.tsx]]
- [[_COMMUNITY_ArticleDetailView.tsx|ArticleDetailView.tsx]]
- [[_COMMUNITY_HeroScene.tsx|HeroScene.tsx]]
- [[_COMMUNITY_AwsRdsScanTab.tsx|AwsRdsScanTab.tsx]]
- [[_COMMUNITY_DatabaseScanTab.tsx|DatabaseScanTab.tsx]]
- [[_COMMUNITY_DynamoDbScanTab.tsx|DynamoDbScanTab.tsx]]
- [[_COMMUNITY_authContext.tsx|authContext.tsx]]
- [[_COMMUNITY_SECTION 3 — FEATURES (Why Segmento)|SECTION 3 — FEATURES ("Why Segmento?")]]
- [[_COMMUNITY_SECTION 6 — PRODUCT SHOWCASE|SECTION 6 — PRODUCT SHOWCASE]]
- [[_COMMUNITY_NavBar.tsx|NavBar.tsx]]
- [[_COMMUNITY_MongodbScanTab.tsx|MongodbScanTab.tsx]]
- [[_COMMUNITY_DESIGN|DESIGN.md]]
- [[_COMMUNITY_SECTION 1 — HERO|SECTION 1 — HERO]]
- [[_COMMUNITY_SECTION 9 — FOOTER|SECTION 9 — FOOTER]]
- [[_COMMUNITY_SECTION 5 — HOW IT WORKS|SECTION 5 — HOW IT WORKS]]
- [[_COMMUNITY_AuthorMetaBlock.tsx|AuthorMetaBlock.tsx]]
- [[_COMMUNITY_SECTION 8 — CTA SECTION|SECTION 8 — CTA SECTION]]
- [[_COMMUNITY_Ubiquitous Language — Segmento Main-Site|Ubiquitous Language — Segmento Main-Site]]
- [[_COMMUNITY_route.ts|route.ts]]
- [[_COMMUNITY_SECTION 2 — TRUST STRIP|SECTION 2 — TRUST STRIP]]
- [[_COMMUNITY_CategoryBadge.tsx|CategoryBadge.tsx]]
- [[_COMMUNITY_fileTypeIcons.tsx|fileTypeIcons.tsx]]
- [[_COMMUNITY_Inspector.tsx|Inspector.tsx]]
- [[_COMMUNITY_route.ts|route.ts]]
- [[_COMMUNITY_SECTION 7 — ECOSYSTEM STRIP|SECTION 7 — ECOSYSTEM STRIP]]
- [[_COMMUNITY_layout.tsx|layout.tsx]]
- [[_COMMUNITY_CardEngagementStats.tsx|CardEngagementStats.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_FooterBar.tsx|FooterBar.tsx]]
- [[_COMMUNITY_useInfiniteScroll.ts|useInfiniteScroll.ts]]
- [[_COMMUNITY_dateUtils.ts|dateUtils.ts]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_Footer.tsx|Footer.tsx]]
- [[_COMMUNITY_Header.tsx|Header.tsx]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]

## God Nodes (most connected - your core abstractions)
1. `APIClient` - 89 edges
2. `useAuth()` - 49 edges
3. `EvaluatorModel` - 36 edges
4. `AnalysisResponse` - 24 edges
5. `getApiBase()` - 20 edges
6. `ModelLabState` - 18 edges
7. `OutOfCreditsError` - 18 edges
8. `compilerOptions` - 16 edges
9. `compilerOptions` - 16 edges
10. `ProfileStatsResponse` - 16 edges

## Surprising Connections (you probably didn't know these)
- `LatestArticlesPage()` --calls--> `fetchNewsByCategory()`  [EXTRACTED]
  pulse/app/latest-articles/page.tsx → pulse/lib/newsApi.ts
- `ConnectorsClient()` --calls--> `useAuth()`  [EXTRACTED]
  sense/app/model-lab/connectors/ConnectorsClient.tsx → sense/lib/authContext.tsx
- `LocalUploadView()` --calls--> `useAuth()`  [EXTRACTED]
  sense/app/model-lab/connectors/LocalUploadView.tsx → sense/lib/authContext.tsx
- `DocumentViewerModal()` --calls--> `useAuth()`  [EXTRACTED]
  sense/components/model-lab/DocumentViewerModal.tsx → sense/lib/authContext.tsx
- `Props` --references--> `EvaluatorModel`  [EXTRACTED]
  sense/components/model-lab/tabs/AwsGlueScanTab.tsx → sense/lib/apiClient.ts

## Import Cycles
- 3-file cycle: `sense/app/model-lab/ModelLabClient.tsx -> sense/components/model-lab/ModelLabTabs.tsx -> sense/components/model-lab/tabs/CompareTab.tsx -> sense/app/model-lab/ModelLabClient.tsx`
- 3-file cycle: `sense/app/model-lab/ModelLabClient.tsx -> sense/components/model-lab/ModelLabTabs.tsx -> sense/components/model-lab/tabs/DocumentViewTab.tsx -> sense/app/model-lab/ModelLabClient.tsx`
- 3-file cycle: `sense/app/model-lab/ModelLabClient.tsx -> sense/components/model-lab/ModelLabTabs.tsx -> sense/components/model-lab/tabs/FailuresTab.tsx -> sense/app/model-lab/ModelLabClient.tsx`
- 3-file cycle: `sense/app/model-lab/ModelLabClient.tsx -> sense/components/model-lab/ModelLabTabs.tsx -> sense/components/model-lab/tabs/MetricsTab.tsx -> sense/app/model-lab/ModelLabClient.tsx`
- 3-file cycle: `sense/app/model-lab/ModelLabClient.tsx -> sense/components/model-lab/ModelLabTabs.tsx -> sense/components/model-lab/tabs/UploadScanTab.tsx -> sense/app/model-lab/ModelLabClient.tsx`

## Communities (106 total, 19 thin omitted)

### Community 1 - "ModelLabClient.tsx"
Cohesion: 0.06
Nodes (25): DEFAULT_STATE, ModelLabClient(), ModelLabState, BADGE_MODELS, STAT_CARDS, FALLBACK_CATALOGUE, Props, TABS (+17 more)

### Community 2 - "dependencies"
Cohesion: 0.05
Nodes (43): dependencies, class-variance-authority, clsx, date-fns, firebase, framer-motion, lucide-react, next (+35 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (43): dependencies, class-variance-authority, clsx, framer-motion, lucide-react, next, plotly.js-dist-min, @radix-ui/react-accordion (+35 more)

### Community 4 - "Hero.tsx"
Cohesion: 0.06
Nodes (16): fadeUp(), Features(), fadeUp(), Hero(), PID, PRODUCTS, CollectShell(), PulseShell() (+8 more)

### Community 5 - "page.tsx"
Cohesion: 0.06
Nodes (25): AIEngineTeaser(), LAYER_BADGES, CounterSection(), DocumentFeatures(), features, cardVariants, containerVariants, enterpriseFeatures (+17 more)

### Community 6 - "page.tsx"
Cohesion: 0.08
Nodes (26): AIEnginePage(), metadata, AIEngineCTA(), AIEngineHero(), INDUSTRY_CATEGORIES, IndustryContext(), ModelCardGrid(), TAB_LAYERS (+18 more)

### Community 7 - "Navbar.tsx"
Cohesion: 0.07
Nodes (16): director, milestones, team, openRoles, footerLinks, socialLinks, MegaFeatured, MegaItem (+8 more)

### Community 8 - "EvaluatorModel"
Cohesion: 0.09
Nodes (18): AzureScanTab(), FileScanResult, Props, Step, Props, Props, SalesforceScanTab(), Step (+10 more)

### Community 9 - "ProfileClient.tsx"
Cohesion: 0.10
Nodes (10): metadata, ToastType, Props, Props, Props, Props, Props, Props (+2 more)

### Community 10 - "FormatScanTab.tsx"
Cohesion: 0.08
Nodes (23): ACC_COLOR(), getPiiColor(), ModelCard(), ModelInfo, ModelShowdownResult, PII_LABEL_COLORS, PiiBadge(), Prediction (+15 more)

### Community 11 - "devDependencies"
Cohesion: 0.08
Nodes (25): dependencies, framer-motion, lucide-react, next, next-themes, node-appwrite, react, react-dom (+17 more)

### Community 12 - "DocumentViewerModal.tsx"
Cohesion: 0.11
Nodes (18): FileTypeCard(), LocalUploadView(), Props, DocumentViewerModal(), Props, Tab, getFileTypeIcon(), CATEGORIES (+10 more)

### Community 13 - "apiClient.ts"
Cohesion: 0.12
Nodes (20): COLORS, PIIAnalytics(), PIIAnalyticsProps, AwsRdsCredentials, BatchDocResult, CatalogResponse, ConnectorStatEntry, CreditsResponse (+12 more)

### Community 14 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+13 more)

### Community 15 - "NewsletterHub.tsx"
Cohesion: 0.17
Nodes (14): NewsletterCTA(), NewsletterCard(), NewsletterCardProps, ALL_PREFERENCES, getTheme(), NEWSLETTER_THEMES, NewsletterTheme, PreferenceKey (+6 more)

### Community 16 - "ConnectorPreviewUI.tsx"
Cohesion: 0.14
Nodes (17): ProfileClient(), classificationToPiiState(), DEFAULT_SCAN_TYPE, FileRow(), FolderRow(), formatBytes(), formatDate(), getFileIcon() (+9 more)

### Community 17 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 18 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 19 - "layout.tsx"
Cohesion: 0.12
Nodes (11): inter, metadata, playfair, SenseNavbar(), ThemeToggle(), ICONS, STYLES, Toast (+3 more)

### Community 20 - "newsApi.ts"
Cohesion: 0.19
Nodes (14): CATEGORY_UI_METADATA, CategoryPage(), categoryRelationships, CategoryUI, Page(), PulseBlogHomeClient(), fetchNewsByCategory(), fetchResearchPaperById() (+6 more)

### Community 21 - "CardScene.tsx"
Cohesion: 0.12
Nodes (6): BG_MAP, CardSceneProps, CardSceneVariant, SCENE_MAP, CardSceneDynamic, HeroSceneDynamic

### Community 22 - "analytics.ts"
Cohesion: 0.21
Nodes (13): CommentSectionProps, addComment(), Comment, fetchWithTimeout(), getArticleStats(), getTrendingArticles(), incrementArticleView(), statsCache (+5 more)

### Community 23 - "SenseComparisonTable.tsx"
Cohesion: 0.17
Nodes (11): metadata, CATEGORY_META, DEFAULT_SELECTED, SenseComparisonTable(), SenseComparisonTableProps, COMPARISON_DATA, ComparisonCategory, ComparisonRow (+3 more)

### Community 24 - "ConnectorsClient.tsx"
Cohesion: 0.13
Nodes (10): Connector, ConnectorId, CONNECTORS, ConnectorsClient(), FALLBACK_CATALOGUE, FlowState, GmailScanTab(), Props (+2 more)

### Community 25 - "useAuth"
Cohesion: 0.15
Nodes (9): AuthGate(), AwsGlueScanTab(), Props, Step, GCSScanTab(), SlackScanTab(), useAuthGuard(), GlueCredentials (+1 more)

### Community 26 - "AnalysisResponse"
Cohesion: 0.15
Nodes (9): TableScanEntry, TableScanEntry, TableScanEntry, FileScanResult, MariadbScanTab(), Props, Step, TableScanEntry (+1 more)

### Community 27 - "HomePageClient.tsx"
Cohesion: 0.19
Nodes (11): aestheticColors, ArticlesByTopic(), TOPICS, HeroSection(), formatDate(), aestheticColors, DEFAULT_TOPIC_SECTIONS, HomePageClientProps (+3 more)

### Community 28 - "DriveScanTab.tsx"
Cohesion: 0.18
Nodes (7): DriveScanTab(), Props, Step, useAutoRefresh(), UseAutoRefreshOptions, UseAutoRefreshResult, FileCatalogEntry

### Community 29 - "page.tsx"
Cohesion: 0.29
Nodes (5): Button, ButtonProps, buttonVariants, Input, cn()

### Community 30 - "apiBase.ts"
Cohesion: 0.20
Nodes (5): ArticleInteraction(), ArticleInteractionProps, EngagementStats, useEngagement(), UseEngagementReturn

### Community 31 - "Segmento Main-Site — Upgraded Content Blueprint v2.0"
Cohesion: 0.18
Nodes (10): COMPLETE SECTION ORDER (Final), Design Notes, DESIGN TOKENS (Non-negotiable), DRIBBBLE / MOBBIN MASTER SEARCH LIST, FULL PAGE FLOW, KEY DESIGN RULES (Locked), NAVBAR, Products Dropdown (+2 more)

### Community 32 - "SubscriptionManager.tsx"
Cohesion: 0.29
Nodes (5): NEWSLETTER_TYPES, SubscriptionManagerProps, pulseFirebaseConfig, fetchUserSubscription(), UserSubscription

### Community 33 - "AudioSummaryButton.tsx"
Cohesion: 0.25
Nodes (8): AudioPlayer(), AudioPlayerProps, AudioSummaryButton(), AudioSummaryButtonProps, CATCHY_MESSAGES, FloatingNote, MUSIC_EMOJIS, cn()

### Community 34 - "HeroSection.tsx"
Cohesion: 0.18
Nodes (6): aestheticColors, CENTER_BOTTOM, CENTER_FEATURED, HeroSectionProps, LEFT_CARDS, RIGHT_LIST

### Community 35 - "layout.tsx"
Cohesion: 0.27
Nodes (5): Message, metadata, dmMono, monaSans, syne

### Community 36 - "CategoryPage.tsx"
Cohesion: 0.22
Nodes (6): LatestArticlesPage(), TAGS, aestheticColors, Article, CategoryPageProps, CategoryPageTemplate()

### Community 37 - "ArticleDetailView.tsx"
Cohesion: 0.20
Nodes (4): ArticleDetailViewProps, TimeDisplayProps, ViewCounterProps, getArticleViewCount()

### Community 39 - "AwsRdsScanTab.tsx"
Cohesion: 0.20
Nodes (5): AwsRdsScanTab(), ENGINE_DEFAULTS, EngineType, Props, Step

### Community 40 - "DatabaseScanTab.tsx"
Cohesion: 0.20
Nodes (5): DatabaseScanTab(), DB_DEFAULTS, DbType, Props, Step

### Community 41 - "DynamoDbScanTab.tsx"
Cohesion: 0.20
Nodes (5): DynamoDbScanTab(), Props, Step, TableScanEntry, DynamoDbCredentials

### Community 42 - "authContext.tsx"
Cohesion: 0.31
Nodes (8): clearAuthSession(), getAuthToken(), getAuthUser(), isAuthenticated(), setAuthSession(), api, AuthContext, AuthContextType

### Community 43 - "SECTION 3 — FEATURES ("Why Segmento?")"
Cohesion: 0.22
Nodes (9): BENTO GRID LAYOUT, HERO TILE — 100% Client-Side Processing, MEDIUM TILE — Explainable AI, SECTION 3 — FEATURES ("Why Segmento?"), Section Heading, Section Label (pill tag), Section Subtext, SMALL TILE — Zero-Trust Data Handling (+1 more)

### Community 44 - "SECTION 6 — PRODUCT SHOWCASE"
Cohesion: 0.22
Nodes (9): Product 1 — Segmento Pulse *(Left text / Right visual)*, Product 2 — Segmento Sense *(Right text / Left visual — alternates)*, Product 3 — Segmento Collect *(Left text / Right visual)*, Product 4 — Segmento Resolve *(Right text / Left visual — alternates)*, Product 5 — Segmento SprintQL *(Left text / Right visual)*, SECTION 6 — PRODUCT SHOWCASE, Section Heading, Section Label (+1 more)

### Community 45 - "NavBar.tsx"
Cohesion: 0.28
Nodes (5): PulseLogo(), CATEGORIES, MAIN_NAV, NavBar(), ThemeToggle()

### Community 46 - "MongodbScanTab.tsx"
Cohesion: 0.22
Nodes (4): MongodbScanTab(), Props, Step, TableScanEntry

### Community 47 - "DESIGN.md"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 48 - "SECTION 1 — HERO"
Cohesion: 0.25
Nodes (8): Announcement Badge (pill above headline), H1 Headline, Hero Visual — RIGHT SIDE (Critical), Primary CTA Button, Secondary CTA Button, SECTION 1 — HERO, Subheadline, Trust Line (small text below buttons)

### Community 49 - "SECTION 9 — FOOTER"
Cohesion: 0.25
Nodes (8): Column: Company, Column: Compliance, Column: Legal, Column: Products, Compliance badges row (bottom of footer), Copyright line, SECTION 9 — FOOTER, Tagline under logo

### Community 50 - "SECTION 5 — HOW IT WORKS"
Cohesion: 0.25
Nodes (8): Layout, SECTION 5 — HOW IT WORKS, Section Heading, Section Label (pill tag), Section Subtext, Step 1 — CONNECT, Step 2 — DETECT, Step 3 — CONTROL

### Community 51 - "AuthorMetaBlock.tsx"
Cohesion: 0.36
Nodes (7): AuthorMetaBlock(), AuthorMetaBlockProps, AVATAR_BG_PALETTE, getAvatarBg(), getInitials(), InitialsAvatar(), resolveAuthorName()

### Community 52 - "SECTION 8 — CTA SECTION"
Cohesion: 0.29
Nodes (7): Heading, Layout, Primary Button, Secondary Button, SECTION 8 — CTA SECTION, Subtext, Trust micro-line (below buttons)

### Community 53 - "Ubiquitous Language — Segmento Main-Site"
Cohesion: 0.29
Nodes (6): Contact Page, Design Tokens (Nav-specific), Navigation, Products, Theming Architecture, Ubiquitous Language — Segmento Main-Site

### Community 54 - "route.ts"
Cohesion: 0.48
Nodes (6): BACKEND_URL, DELETE(), GET(), POST(), proxyRequest(), PUT()

### Community 55 - "SECTION 2 — TRUST STRIP"
Cohesion: 0.33
Nodes (6): Caption text (small, centered below), Layout, Left Side — Compliance Badges (monochromatic icons), Right Side — Ecosystem Logos (grayed out, monochrome), SECTION 2 — TRUST STRIP, Separator

### Community 56 - "CategoryBadge.tsx"
Cohesion: 0.47
Nodes (5): CategoryBadge(), CategoryBadgeProps, DOT_PALETTE, getDotColor(), resolveTag()

### Community 57 - "fileTypeIcons.tsx"
Cohesion: 0.33
Nodes (4): FALLBACK, FileTypeIconInfo, GenericFileIcon, ICON_MAP

### Community 58 - "Inspector.tsx"
Cohesion: 0.40
Nodes (4): Inspector(), InspectorProps, PALETTE, InspectorResult

### Community 59 - "route.ts"
Cohesion: 0.60
Nodes (3): ContactFormData, POST(), getAppwriteClient()

### Community 60 - "SECTION 7 — ECOSYSTEM STRIP"
Cohesion: 0.40
Nodes (5): Caption (centered, below marquee), Layout, Logos to include, SECTION 7 — ECOSYSTEM STRIP, Section Label

## Knowledge Gaps
- **440 isolated node(s):** `director`, `team`, `milestones`, `ContactFormData`, `openRoles` (+435 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `APIClient` connect `APIClient` to `ModelLabClient.tsx`, `AwsRdsScanTab.tsx`, `EvaluatorModel`, `ProfileClient.tsx`, `DatabaseScanTab.tsx`, `DynamoDbScanTab.tsx`, `DocumentViewerModal.tsx`, `FormatScanTab.tsx`, `MongodbScanTab.tsx`, `apiClient.ts`, `authContext.tsx`, `ConnectorsClient.tsx`, `useAuth`, `AnalysisResponse`, `DriveScanTab.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `getApiBase()` connect `analytics.ts` to `SubscriptionManager.tsx`, `AudioSummaryButton.tsx`, `NewsletterHub.tsx`, `newsApi.ts`, `page.tsx`, `apiBase.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `director`, `team`, `milestones` to the rest of the system?**
  _440 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `APIClient` be split into smaller, more focused modules?**
  _Cohesion score 0.05879692446856626 - nodes in this community are weakly interconnected._
- **Should `ModelLabClient.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06294326241134751 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._