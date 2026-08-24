# MAINTENANCE LOG — Portfolio Yassine El Idrissi

Journal des actions de maintenance, nettoyage et évolution du site.
Format : `[date] — fichier/zone — action — raison — statut`.
Complète l'ACTION LOG historique du whitepaper (`Whitepaper d'architecture — Portfolio Yassine El Idrissi.txt`).

---

## 2026-08-24 (suite) — Retrait des tirets cadratins (—) du contenu du site

### FAIT
- `[2026-08-24]` — Sur demande du propriétaire (poursuite du nettoyage entamé sur la section Languages, `becfd92`) : tous les tirets cadratins restants dans le contenu affiché du site retirés, remplacés par la ponctuation standard adaptée au contexte (deux-points pour introduire une liste/précision, virgule pour une pause de phrase, `|` pour les titres composés — cohérent avec `ProjectLayout.astro` qui utilise déjà `|`) — statut : fait
- `[2026-08-24]` — `src/i18n/ui.ts` — 6 chaînes (meta description accueil/à propos EN+FR, message 404 EN+FR) — statut : fait
- `[2026-08-24]` — `src/pages/404.astro` — titre d'onglet `` `404 — ${t(...)}` `` → `` `404 | ${t(...)}` `` — statut : fait
- `[2026-08-24]` — `src/content/projects/{en,fr}/biomimicry.md` — champ `title` (contenu appartenant au propriétaire, édition ponctuation uniquement sur demande explicite) — statut : fait
- `[2026-08-24]` — `public/llms.txt` — titre H1 — statut : fait
- Hors périmètre, volontairement non touché : commentaires de code (`.astro`/`.ts`/`.js`/`.css`, non rendus aux visiteurs) et commentaires YAML en tête des fichiers `.md` FR (`# Images gérées uniquement...`) — pas du contenu du site. Vérifié : `npm run build` passe, `grep -r "—" dist/ --include="*.html"` ne retourne plus aucun résultat.

## 2026-08-24 — Fix 404 `/fr/#projects` et `/fr/#contact` (liens navbar "Travaux"/"Contact")

### FAIT — bug routing FR
- `[2026-08-24]` — Signalé par le propriétaire : en version FR, sur n'importe quelle page hors accueil, cliquer sur "Travaux" ou "Contact" dans la navbar renvoyait un 404. Même classe de bug que le fix `/fr/` du 2026-07-28 (suite 4), pas couverte à l'époque — `src/components/Navbar.astro` construisait ces deux liens via `getRelativeLocaleUrl(lang, "/#projects")` / `"/#contact"`, ce qui concatène en `/fr/#projects` : le fragment n'est jamais envoyé au serveur, seul le chemin `/fr/` l'est, et `build.format:'file'` ne génère jamais `dist/fr/index.html` (seulement `dist/fr.html`) — statut : fait
- `[2026-08-24]` — `src/components/Navbar.astro` — `homeHref` (déjà passé par `stripTrailingSlash()`) déplacé avant la définition de `navLinks` et réutilisé pour construire `${homeHref}#projects` / `${homeHref}#contact` au lieu de repasser par `getRelativeLocaleUrl` — statut : fait, `npm run build` vérifié (`dist/fr/work/900care.html` : `href="/fr#projects"` et `href="/fr#contact"`, plus de slash avant le fragment ; EN inchangé, racine non préfixée)

## 2026-07-28 (suite 6) — Correction du vrai bug d'espacement mobile sous l'image de la project card

### FAIT
- `[2026-07-28]` — Le fix précédent (`gap-xl` → `gap-lg` sur `<article>` dans `ProjectCard.astro`, voir "suite 4"/entrée du même jour) était correct mais insuffisant — le propriétaire a signalé que rien n'avait visuellement changé. Cause réelle trouvée par mesure directe du DOM (`getBoundingClientRect`) sur le site live : `<section>` utilisait aussi `space-y-lg`, dont le sélecteur Tailwind (`:not([hidden])`) n'exclut que les éléments portant l'**attribut HTML** `hidden`, pas la **classe CSS** `.hidden`. Le titre desktop-only à l'intérieur (`hidden md:block`) est caché via la classe, pas l'attribut — sur mobile, Tailwind le comptait quand même comme frère pour le calcul de marge, ajoutant un second `margin-top: 24px` fantôme devant le bloc Client, en plus du gap déjà corrigé entre l'image et la section (48px cumulés au lieu de 24px partout ailleurs dans la carte) — statut : fait
- `[2026-07-28]` — `src/components/ProjectCard.astro` — `<section>` passé de `space-y-lg` à `flex flex-col gap-lg` : le `gap` flexbox ne s'applique qu'entre éléments réellement rendus, quelle que soit la méthode de masquage — insensible à ce piège — statut : fait, vérifié par mesure DOM directe (`gapImgToClientLabel` et `gapClientValueToDescriptionLabel` = 24px exactement, identiques) sur build `preview` avant push

## 2026-07-28 (suite 5) — Audit analytics : consolidation sur Umami, abandon Hotjar/Simple Analytics

### FAIT — stack analytics
- `[2026-07-28]` — Audit demandé par le propriétaire : trois trackers tournaient simultanément dans `BaseLayout.astro` (Umami Cloud, Simple Analytics, Hotjar) + un script Contentsquare mort en commentaire. **Hotjar pose un problème de conformité RGPD/CNIL** (cookies + enregistrement de session = tracker non-essentiel nécessitant un consentement préalable, absent du site) — signalé et validé par le propriétaire — statut : fait
- `[2026-07-28]` — `src/layouts/BaseLayout.astro` — scripts Hotjar et Simple Analytics retirés, commentaire Contentsquare mort retiré. Umami Cloud (`data-website-id` inchangé) reste seul tracker — aucune perte de données historiques — statut : fait
- `[2026-07-28]` — `data-sa-event` (attributs) et `sa_event()`/`window.sa_event` (JS) retirés de `Navbar.astro`, `Footer.astro`, `ProjectCard.astro`, `AboutLayout.astro`, `404.astro`, commentaire obsolète corrigé dans `Button.astro` — statut : fait
- `[2026-07-28]` — Deux points de conversion identifiés sans tracking : téléchargement du CV (`AboutLayout.astro`, lien `exp.cvLink`) et clics sortants "Significant Work" — `data-umami-event` ajouté aux deux, réutilisant le champ `trackingSlug` déjà présent dans `about.types.ts`/`about.{en,fr}.ts` mais jamais câblé — statut : fait
- Vérifié : `npm run build` passe, `dist/about.html` inspecté (scripts Hotjar/SA absents, seule occurrence "Hotjar" restante = texte du CV du propriétaire listant l'outil comme compétence, non touché) — statut : fait

### FAIT — détection rage-click / dead-click
- `[2026-07-28]` — `src/layouts/BaseLayout.astro` — script global (non natif à Umami) ajouté : détecte les clics répétés sur un même élément (± 40px, fenêtre 1.5s) et envoie un événement `umami.track()` — `rage-click` (3 clics sur un élément interactif réel : lien, bouton, tout élément déjà `data-umami-event`) ou `dead-click` (2 clics sur un élément jamais interactif — heading, image non liée, texte). Sélection de texte active au moment du déclenchement = ignoré (évite de confondre un double-clic de sélection avec un dead-click) — statut : fait, `npm run build` vérifié, sortie minifiée relue (logique de garde préservée)
- Limite connue et assumée : volume de trafic faible → signal statistiquement peu robuste (quelques événements/mois au mieux), traité comme un indicateur qualitatif, pas décisionnel.

### DETTE / À SURVEILLER
- `[2026-07-28]` — Session Replay Umami (v3.1+, rrweb) demandé en bonus par le propriétaire mais réservé au palier Cloud "Business" (~200 $/mo) ; propriétaire a choisi de rester sur Cloud sans Replay pour l'instant — à reconsidérer si self-host envisagé un jour.
- `[2026-07-28]` — Exclusion des visites du propriétaire (2 PC + 1 mobile) : méthode officielle Umami = `localStorage.setItem('umami.disabled', 1)` par navigateur/appareil (pas de blocage IP côté Cloud) — à mettre en place manuellement par le propriétaire, pas une action de code.

## 2026-07-28 (suite 4) — Fix 404 `/fr/` (lien logo + sélecteur de langue), tailles drapeaux/dropdown nav

### FAIT — bug routing FR
- `[2026-07-28]` — **`/fr/` (avec slash final) renvoyait 404 sur GitHub Pages** — `build.format:'file'` génère `dist/fr.html` pour `src/pages/fr/index.astro`, jamais `dist/fr/index.html`, donc toute URL générée avec un slash final sur la racine FR (`/fr/`) 404 (pas de rewrite côté GH Pages). Or `getRelativeLocaleUrl(locale, "/")` d'Astro ajoute systématiquement ce slash pour une racine de locale — cassait en pratique le **lien logo/accueil** et le **sélecteur de langue EN→FR** dans `Navbar.astro` (`homeHref`, `switcherHref`), le **hreflang FR** dans `BaseLayout.astro`, et les cibles de redirection `/fr/logos` et `/fr/photography` dans `astro.config.mjs` — statut : fait
- `[2026-07-28]` — `src/i18n/utils.ts` — nouvelle fonction `stripTrailingSlash()` (préserve `"/"` seul, sinon retire le slash final) ; appliquée dans `getLocalizedPath()`, dans `Navbar.astro` (`homeHref`), et dans `BaseLayout.astro` (hreflang par locale + hreflang `x-default`) — statut : fait
- `[2026-07-28]` — `astro.config.mjs` — cibles de redirection `/fr/logos` et `/fr/photography` changées de `/fr/` vers `/fr` — statut : fait
- Choix délibéré : correction ciblée à la source (URLs générées) plutôt que passage de `build.format` à `'directory'` (qui aurait résolu le problème à la racine mais change la forme d'URL de tout le site et le comportement GH Pages — décision utilisateur explicite de ne pas y toucher) — statut : fait, `npm run build` vérifié (hreflang FR et redirections `/fr/logos`→`/fr` confirmés dans `dist/`)

### FAIT — UI navbar
- `[2026-07-28]` — `src/components/icons/FlagIcon.astro` — icônes drapeaux réduites de `20x20` à `17.5x17.5` (≈1/8 plus petit, demande utilisateur) — statut : fait
- `[2026-07-28]` — `src/components/Navbar.astro` — menu déroulant du sélecteur de langue desktop : `right-0` remplacé par `left-1/2 -translate-x-1/2` pour centrer le dropdown sous le bouton de langue sélectionnée — statut : fait

## 2026-07-28 (suite 3) — Publication FR : traductions finalisées, CV FR ajouté, merge sur `main`

### FAIT
- `[2026-07-28]` — `src/content/projects/{en,fr}/{900care,batchcooking,caissedesdepots}.md` — **copie FR finalisée par le propriétaire** (titres, description, méthodologie, insights, delivery, métriques réécrits en FR), corrections mineures de coquilles côté EN (typos, ponctuation) — build vérifié — statut : fait
- `[2026-07-28]` — `public/documents/` — **CV FR ajouté** (`cv_UXPRODUCTDESIGNER_EL_IDRISSI_YASSINE.pdf`) et **CV EN remplacé** (`Resume_UXPRODUCTDESIGNER_EL_IDRISSI_YASSINE.pdf`, ancien fichier `Resume_UXDESIGNEROPS_EL_IDRISSI_YASSINE.pdf` retiré) ; `src/data/about.en.ts` et `about.fr.ts` (`cvLink`) mis à jour pour pointer vers les nouveaux noms de fichiers — vérifié : les deux PDF sont bien copiés dans `dist/documents/` au build — statut : fait
- `[2026-07-28]` — `src/data/home.fr.ts` — commentaire d'en-tête obsolète `[FR TODO]` retiré ; le contenu du hero FR était déjà traduit, seul le commentaire était périmé — statut : fait
- `[2026-07-28]` — **`lang` mergé (fast-forward) sur `main` et poussé** — site FR live, déploiement GitHub Pages déclenché — statut : fait

### DETTE / À SURVEILLER
- `[2026-07-28]` — ~~CV FR manquant (404 sur `/fr/about`)~~ → **RÉSOLU** (voir ci-dessus).
- `[2026-07-28]` — `about.fr.ts` — la section "Significant Work" reste une traduction directe EN→FR non vérifiée contre le CV réel (signalé en commentaire d'en-tête du fichier) — à relire/valider par le propriétaire.
- `[2026-07-28]` — Traduction FR annoncée par le propriétaire comme **~90% complète** au moment de la publication — pas de gap connu identifié en dehors des deux points ci-dessus, mais à revalider visuellement sur le site live.

## 2026-07-28 — Suppression du CV brut (numéro de téléphone en clair, dépôt public)

### FAIT — sécurité / vie privée
- `[2026-07-28]` — `src/data/ELIDRISSI_Yassine_RESUME.md` **supprimé du dépôt**. Ce fichier (notes CV brutes ayant servi à reconstruire `about.fr.ts`, cf. entrée `2026-07-26`) contenait le numéro de téléphone personnel du propriétaire en clair. Le dépôt `yeldrs/portfolio_2026` étant **public**, ce numéro était visible par quiconque consultait le repo — statut : fait
- `[2026-07-28]` — `src/data/about.fr.ts` — commentaire d'en-tête mis à jour pour ne plus référencer le fichier supprimé (contenu déjà migré, rien d'autre ne change) — statut : fait
- **Important — non résolu** : la suppression retire le fichier de l'état actuel du dépôt mais **pas de l'historique Git** — le commit `604a7ee` (déjà poussé sur `origin/lang`, public) contient toujours le numéro en clair et reste consultable via l'historique GitHub. Une purge complète nécessiterait une réécriture d'historique (`git filter-repo`/BFG) + `force-push` sur une branche publique — action destructive, non effectuée sans confirmation explicite du propriétaire — statut : à décider par le propriétaire
- Audit de vie privée plus large mené le même jour (téléphone, adresse, email perso, identifiant GitHub) : aucune adresse postale ni email Gmail trouvés ailleurs dans le dépôt ou le site ; le CV PDF téléchargeable (`public/documents/Resume_UXDESIGNEROPS_EL_IDRISSI_YASSINE.pdf`, historique inclus) était déjà correctement expurgé (« N° on demand ») — statut : fait (audit), aucune autre action nécessaire pour l'instant

## 2026-07-28 — Fix lien externe CDC (YAML + rendu), token de lien, refonte 404

### FAIT — lien externe CDC (SEO)
- `[2026-07-28]` — `src/content/projects/{en,fr}/caissedesdepots.md` — champ `context` : le `<a href="...">` inséré par le propriétaire utilisait des guillemets doubles imbriqués dans une valeur YAML déjà entre guillemets doubles → **YAML invalide, build cassé** (`js-yaml` : *bad indentation of a mapping entry*). Corrigé en passant les attributs de la balise `<a>` en guillemets simples (`href='...' target='_blank' rel='noopener'`) — statut : fait
- `[2026-07-28]` — `src/layouts/ProjectLayout.astro` — bug de rendu découvert en marge du fix ci-dessus : `context`/`problem`/`roleDescription`/`methodology`/`delivery` utilisaient une interpolation brute (`{project.data.field}`) pour le cas chaîne simple (non-tableau), qui échappe le HTML — un lien inséré dans ces champs s'affichait comme texte littéral (`&lt;a href=...&gt;`) au lieu d'un vrai lien cliquable. `keyInsights`/`metrics` géraient déjà correctement ce cas via `set:html`. Les 5 champs alignés sur ce pattern (`<p set:html={...} />`) — statut : fait
- Vérifié : `npm run build` passe, lien CDC inspecté dans `dist/work/depostetconsignations.html` → balise `<a>` réelle et cliquable — statut : fait

### FAIT — token de style hyperlien
- `[2026-07-28]` — `src/styles/tokens.js` — nouveaux rôles sémantiques `text-link` (gray-600) / `text-link-hover` (black), formalisant le style déjà utilisé de façon ad hoc (4 fois, en dur) dans la section Credits de `ProjectLayout.astro` — statut : fait
- `[2026-07-28]` — `src/styles/global.css` — nouvelle classe composant `.link` (`underline text-text-link hover:text-text-link-hover transition-colors`) — statut : fait
- `[2026-07-28]` — `ProjectLayout.astro` — les 4 occurrences en dur (`class="underline hover:text-text-body-primary transition-colors"`) remplacées par `class="link"` ; lien CDC (`context`, en+fr) mis à jour avec `class='link'` — statut : fait
- Note : couleurs reprises telles quelles de l'existant (Credits), non vérifiées contre Figma — à confirmer par le propriétaire si un style de lien différent est prévu côté design.

### FAIT — refonte page 404
- `[2026-07-28]` — `src/pages/404.astro` — reconstruite entièrement. Retiré : classes Tailwind inexistantes/inertes (`bg-primary`, `border-neutral`, `text-primary` — aucune ne correspond à un token ou à la palette Tailwind par défaut), SVG illustratif avec couleurs hex en dur et texte "Page not found" gravé dans l'image (non traduisible, dupliquait le `<h1>`), `<main>` imbriqué dans le `<main>` de `BaseLayout` (HTML invalide) — statut : fait
- `[2026-07-28]` — Reconstruite avec les briques existantes uniquement : chiffre « 404 » décoratif (`aria-hidden`) au style du Hero homepage (`h-display italic font-semibold text-heading-accent`), vrai `<h1>` avec le titre traduit (clé `page404.title` déjà existante), composant `Button` (variant `primary`) pour le CTA — statut : fait
- `[2026-07-28]` — Sur demande du propriétaire, second CTA « See projects » retiré (un seul bouton « Go home »). Clé i18n `page404.seeProjects` (en+fr) supprimée de `src/i18n/ui.ts`, devenue inutilisée — statut : fait
- Vérifié : `npm run build` passe ; page testée en navigateur (Chrome via preview server) sur route inexistante → rendu conforme, navbar/footer présents (voir ci-dessous), CTA fonctionnel — statut : fait
- Discuté avec le propriétaire : navbar/footer volontairement conservés sur la 404 (seul chemin de recovery si "Go home" n'est pas la destination voulue ; cohérence de marque ; `BaseLayout` les fournit déjà sans coût supplémentaire) — décision documentée, pas une dette.

## 2026-07-27 (suite) — Champs de section optionnels, sections masquées si vides

### FAIT
- `[2026-07-27]` — `src/content/config.ts` : `context`, `problem`, `roleDescription`, `keyInsights`, `methodology`, `delivery`, `metrics` passent en `.optional()` (schéma Zod) — chaque section du case study est désormais optionnelle, plus seulement `designConception` — statut : fait
- `[2026-07-27]` — `src/layouts/ProjectLayout.astro` : ajout d'un helper `hasContent()` + booléens `hasContext`/`hasProblem`/`hasRoleDescription`/`hasKeyInsights`/`hasMethodology`/`hasDesignConception`/`hasDelivery`/`hasMetrics` — chaque bloc titre+corps est masqué si le champ correspondant est absent ou vide (chaîne vide, tableau vide, ou tableau ne contenant que des chaînes vides). `contextSummary` (fallback meta description/JSON-LD) gère aussi `context` désormais `undefined` — statut : fait
- Vérifié : `npm run build` passe sans erreur sur les 3 case studies existants (EN+FR), tous les champs étant actuellement renseignés donc aucune section masquée en pratique — comportement de masquage non testé visuellement avec un champ réellement vide (à faire si l'utilisateur omet un champ dans une prochaine fiche) — statut : fait (schéma/rendu), à vérifier visuellement à l'usage

## 2026-07-27 — Bullet points sur tous les champs de section, règle dure anti-rédaction

### FAIT
- `[2026-07-27]` — `src/content/config.ts` : `context`, `problem`, `roleDescription`, `methodology`, `delivery` passent de `z.string()` à `z.union([z.string(), z.array(z.string())])`, même pattern que `keyInsights`/`metrics` déjà en place — statut : fait
- `[2026-07-27]` — `src/layouts/ProjectLayout.astro` : rendu conditionnel (`Array.isArray(...)` → `<ul class="list-disc">` sinon `<p>`) ajouté pour ces 5 champs, identique au pattern `keyInsights`/`metrics`. Ajout de `contextSummary`/`metaDescription` (frontmatter du layout) pour garder une description meta/JSON-LD en texte plat même quand `context` est un tableau — statut : fait
- `[2026-07-27]` — `CLAUDE.md` — règle dure ajoutée : aucune édition de rédaction (case studies, CV/about, homepage, tout contenu user-owned) sans demande ou validation explicite du propriétaire, même en marge d'un changement structurel — statut : fait

## 2026-07-26 (suite 3) — Icônes drapeaux réelles, alignement dropdown, attribution

### FAIT
- `[2026-07-26]` — `src/components/icons/FlagIcon.astro` (nouveau) : icônes drapeaux circulaires EN/FR extraites du composant Figma fourni par le propriétaire (2 variants), taille ajustée à 20px, `clipPath` avec id unique par instance (`node:crypto` `randomUUID()`) pour éviter les doublons d'id SVG. Remplace les points pleins `bg-background-brand` dans `Navbar.astro` (bouton desktop, dropdown, version mobile) — statut : fait
- `[2026-07-26]` — `Navbar.astro` : dropdown resserré (`min-w-[6.5rem]` → `w-max`, `mt-2` → `mt-1.5`) pour qu'il colle exactement à la largeur de son contenu et reste bien aligné à droite sous le nav-link de langue. Vérifié en navigateur (mesure JS des `getBoundingClientRect`, bord droit bouton = bord droit dropdown au pixel près) puis visuellement après resserrement — statut : fait
- `[2026-07-26]` — `.claude/settings.json` (nouveau) : `attribution.commit`/`attribution.pr` mis à `""` — Claude ne sera plus jamais cité comme co-auteur dans les commits/PR de ce repo — statut : fait
- `[2026-07-26]` — `CLAUDE.md` — règle dure ajoutée : ne jamais créditer Claude/un assistant IA (commits, PR, site) — statut : fait

## 2026-07-26 (suite 2) — Images single-source, switcher discret, CLAUDE.md refresh

### FAIT — images (single source of truth en/)
- `[2026-07-26]` — `src/content/config.ts` : `cardImage` rendu optionnel (Zod) pour permettre aux fiches `fr/*.md` de l'omettre — `projectImages` déjà optionnel — statut : fait
- `[2026-07-26]` — `src/content/resolveImages.ts` (nouveau) : résout `cardImage`/`projectImages` manquants sur une entrée en cherchant l'entrée `en/` de même `semanticSlug`, au build. Branché dans `HomeLayout.astro` (liste projets FR) et `src/pages/fr/work/[slug].astro` — statut : fait
- `[2026-07-26]` — Retiré `cardImage`/`projectImages` des 4 fiches `src/content/projects/fr/*.md` (900care, batchcooking, caissedesdepots, biomimicry) — les images se gèrent désormais **uniquement** dans les fichiers `en/*.md` équivalents, propagées automatiquement à toutes les langues. Vérifié : `/fr/work/*` et la liste projets `/fr` affichent toujours les bonnes images après build — statut : fait

### FAIT — sélecteur de langue (design plus discret)
- `[2026-07-26]` — `Navbar.astro` : remplacement des emoji drapeaux par un point plein `bg-background-brand` (couleur de marque existante, pas de nouvelle couleur ajoutée) + libellé texte, suppression du bouton en pill bordée (trop massif) au profit d'un déclencheur minimal, dropdown compact avec bordure fine `border-stroke-neutral-primary`. Design fourni par le propriétaire (export Figma), couleurs vérifiées 1:1 avec les tokens existants (`#4364E8` = accent-action/600, `#030712`/`#4A5565` = text-body-primary/secondary, `#D1D5DC` = stroke-neutral-primary) — statut : fait

### FAIT — process
- `[2026-07-26]` — `CLAUDE.md` — refonte complète post-i18n : carte d'architecture (routing bilingue, `i18n/`, `data/`, `layouts/`, `content/projects/{en,fr}/`), nouvelle section "i18n architecture", nouvelle section "Image convention" (single source en/), règles dures ajoutées (jamais redéclarer cardImage/projectImages en fr/, jamais de string en dur hors `ui.ts`), dette connue mise à jour (home.fr.ts placeholder, asymétrie about.en/fr voulue, CV PDF FR manquant) — statut : fait

## 2026-07-26 — Scaffolding i18n FR (objectif : scaler le site en version française)

### Décisions cadrage (validées par le propriétaire)
- **Branche de travail :** `main` uniquement. Une tentative précédente existait sur `feature/multi-lang` (dernier commit « failed », archi inversée FR-racine/EN-préfixé) — **ignorée volontairement**, non reprise.
- **URL :** EN reste à la racine (non préfixé, aucun `/en/`), FR vit sous `/fr/`. Zéro impact sur les URLs canoniques EN existantes.
- **Slugs :** `semanticSlug` identique dans les deux langues (`/work/900care` et `/fr/work/900care`) — pas de table de correspondance à maintenir.
- **Propriété du contenu :** cette passe ne fait que le scaffolding technique + traduction des chaînes UI génériques (nav, footer, libellés de section type Context/Role/Metrics). Le contenu long (bio about.astro, case studies) reste en placeholder `[FR TODO]` — le propriétaire a déjà des traductions prêtes (CV/about + 900.care, Caisse des Dépôts, Batchcooking) qu'il ajoutera lui-même après.

### FAIT
- `[2026-07-26]` — `astro.config.mjs` — **i18n natif Astro** ajouté (`defaultLocale: 'en'`, `locales: ['en','fr']`, `prefixDefaultLocale: false`) + option i18n de `@astrojs/sitemap` (hreflang auto) + redirections `/fr/*` miroir des redirections EN existantes — statut : fait
- `[2026-07-26]` — `src/i18n/ui.ts` + `src/i18n/utils.ts` — **dictionnaire de traduction UI** (en/fr) et helpers (`useTranslations`, `getLocalizedPath`, `stripLocalePrefix`, `cleanPathname`) — statut : fait
- `[2026-07-26]` — `src/content/projects/*.md` → **déplacés dans `src/content/projects/en/`** (via `git mv`, historique préservé) ; `src/content/projects/fr/` créé (vide, en attente du contenu FR du propriétaire). Schéma Zod de `config.ts` inchangé — statut : fait
- `[2026-07-26]` — `BaseLayout.astro` — `lang` dynamique (`Astro.currentLocale`), `og:locale` mappé, balises `hreflang` (en/fr/x-default) — statut : fait
- `[2026-07-26]` — `Navbar.astro` / `Footer.astro` — libellés traduits via `t()`, liens construits avec `getRelativeLocaleUrl`, **sélecteur de langue EN|FR** ajouté (desktop + mobile) — statut : fait
- `[2026-07-26]` — `src/data/home.{en,fr}.ts`, `about.{en,fr}.ts` + `src/components/pages/HomeContent.astro`, `AboutContent.astro` — contenu de `index.astro`/`about.astro` extrait en composants paramétrés par `lang` ; versions FR = placeholders `[FR TODO]` à écraser par le propriétaire — statut : fait
- `[2026-07-26]` — `src/layouts/ProjectLayout.astro` (nouveau, extrait de l'ancien `work/[slug].astro`) — tous les titres de section/aria-labels traduits via `t()` ; `src/pages/work/[slug].astro` (EN) et `src/pages/fr/work/[slug].astro` (nouveau) filtrent la collection par préfixe de slug (`en/`, `fr/`) — statut : fait
- `[2026-07-26]` — `ProjectCard.astro` — prop `lang`, libellés Client/Description/Role/View project traduits (corrige au passage un aria-label codé en dur en français sur un site anglophone) — statut : fait
- `[2026-07-26]` — Build vérifié (`npm run build`) : routes EN + `/fr/`, `/fr/about` générées ; `/fr/work/*` génère 0 page tant qu'aucun `.md` FR n'est déposé (attendu) ; sitemap contient les annotations hreflang pour `/` et `/about` — statut : fait

### DETTE / À SURVEILLER
- `[2026-07-26]` — ~~Contenu FR manquant (case studies)~~ → **RÉSOLU** (voir suite ci-dessous, 3 fiches FR ajoutées par le propriétaire). `src/data/home.fr.ts` (hero accueil) reste en placeholder `[FR TODO]`.
- `[2026-07-26]` — **`404.astro`** reste une page unique non traduite (GitHub Pages ne sert qu'un seul `404.html`, quel que soit le préfixe de langue) — limitation assumée, pas une dette.
- `[2026-07-26]` — **`biomimicry.md`** reste EN seul (`isDraft: true`), aucune traduction FR nécessaire tant qu'il n'est pas publié.

## 2026-07-26 (suite) — Contenu FR, audit exhaustif, refactor rangement, switcher, SEO

### FAIT — contenu et audit
- `[2026-07-26]` — 3 fiches `.md` FR ajoutées par le propriétaire dans `src/content/projects/fr/` (900.care, Caisse des Dépôts, Batchcooking, + biomimicry-draft) — schéma Zod validé, build OK, pages `/fr/work/*` générées. Images partagées avec les fichiers EN (mêmes chemins `/images/...`), rien à dupliquer.
- `[2026-07-26]` — Bugs trouvés et corrigés pendant l'audit exhaustif FR/EN (contenu, alt, aria-labels, SEO) : trait d'union insécable (`&#8209;`) double-échappé en texte brut dans `<title>`/alt/JSON-LD sur les pages projet (pré-existant, touchait déjà l'EN) → nouveau helper `plainText()` dans `i18n/utils.ts` ; carrousel (`ProjectCarousel.astro`) et section projets de l'accueil (`HomeContent.astro`) pas du tout câblés à la traduction → corrigé ; aria-label codé en dur en français sur `ProjectCard.astro` même côté EN → corrigé.
- `[2026-07-26]` — `src/data/about.fr.ts` reconstruit à partir du CV fourni par le propriétaire (`src/data/ELIDRISSI_Yassine_RESUME.md`) : nouvelle expérience « Product designer R&D », compétences restructurées (Analyse et stratégie / Outils de design / AI et Web), formations, projets marquants (2 repris du wording FR déjà validé des case studies, 1 traduit directement). `about.en.ts` volontairement laissé inchangé (décision propriétaire : ne mettre à jour que le FR pour l'instant) — statut : fait
- `[2026-07-26]` — **Section Langues** ajoutée à `about.types.ts` (nouveau champ `languages`) + `about.en.ts` et `about.fr.ts` (Français/Native, Anglais/C1, Italien/C1, Espagnol/A2, Arabe/A1) + rendu dans `AboutLayout.astro` — statut : fait
- `[2026-07-26]` — CV téléchargeable FR : lien pointe vers `/documents/Resume_UXDESIGNEROPS_EL_IDRISSI_YASSINE_FR.pdf` — fichier PDF à déposer par le propriétaire, sinon 404 — statut : en attente du fichier

### FAIT — rangement architecture
- `[2026-07-26]` — `src/components/pages/{Home,About}Content.astro` → **déplacés vers `src/layouts/{Home,About}Layout.astro`** (renommés, imports corrigés), pour aligner avec `ProjectLayout.astro`/`BaseLayout.astro`. Règle désormais explicite : `pages/` = routing pur (fichiers fins), `layouts/` = composition réelle de la page, `components/` = briques UI réutilisables. Décision propriétaire : pas de migration home/about vers Content Collections pour l'instant (TypeScript reste adapté, contenu qui change peu) — statut : fait

### FAIT — sélecteur de langue (UX)
- `[2026-07-26]` — `Navbar.astro` — logique inversée : le bouton affiche désormais la langue **active** (drapeau + code, ex. 🇬🇧 EN), au clic un petit dropdown liste les deux langues (active = span inerte non cliquable, autre = lien cliquable vers l'équivalent de la page courante). Changement de langue uniquement sur sélection de l'autre langue. Vérifié en navigateur (dev server + Claude in Chrome) : ouverture/fermeture du dropdown, aller-retour EN→FR→EN en conservant la même page — statut : fait
- Note : sur ce poste Windows/Chrome, les emoji drapeaux s'affichent en code pays ("GB"/"FR") plutôt qu'en drapeau coloré — limitation de rendu des polices Windows, pas un bug côté code.

### FAIT — SEO FR (suite à demande explicite)
- `[2026-07-26]` — `inLanguage` (schema.org) ajouté au JSON-LD `Person` (`BaseLayout.astro`) et `CreativeWork` (`ProjectLayout.astro`), reflète `en-US`/`fr-FR` selon la page — statut : fait
- `[2026-07-26]` — Sitemap : hreflang désormais présent aussi sur les 3 pages `/work/*` (absent lors du premier build car le contenu FR n'existait pas encore) — vérifié, aucun changement de code nécessaire — statut : fait (auto-résolu)
- `[2026-07-26]` — `public/llms.txt` — mis à jour : liste les 3 case studies FR, mentionne le site bilingue et le champ `inLanguage` — statut : fait

### FAIT — process
- `[2026-07-26]` — `CLAUDE.md` — ajout d'une consigne explicite : lire `MAINTENANCE_LOG.md` une fois en début de session (pas à chaque message), et ajouter une entrée datée après tout changement majeur (skip pour les micro-edits) — statut : fait

## 2026-07-11 — Audit d'architecture + nettoyage

### Décisions cadrage (validées par le propriétaire)
- **Hébergement :** domaine + email achetés chez Hostinger (registrar / MX). Le **site** est servi par **GitHub Pages** (`CNAME` + `.github/workflows/deploy.yml`). → `.htaccess` (Apache) est très probablement inactif mais conservé (risque > bénéfice à le supprimer).
- **Design System :** consigne « ne pas toucher ». Aucune modification de `tokens.js` / `tailwind.config.mjs`. Divergences documentées ci-dessous, non corrigées.
- **Formulaire de contact :** `ContactFormSection.astro` à supprimer (contact réel = copie d'email via `Footer.astro`).

### FAIT
- `[2026-07-11]` — `.github/agents/assistant.agent.md` — **supprimé** — fichier vide (0 octet), résidu — statut : fait
- `[2026-07-11]` — `src/components/Welcome.astro` — **supprimé** — orphelin (résidu du starter Astro, jamais importé) — statut : fait
- `[2026-07-11]` — `src/components/ContactFormSection.astro` — **supprimé** — orphelin + endpoint Formspree factice ; décision propriétaire — statut : fait
- `[2026-07-11]` — `public/images/profile-pic1.jpg` — **supprimé** — non référencé nulle part (doublon de `profile-pic.webp`) — statut : fait
- `[2026-07-11]` — `public/.htaccess` — **nettoyé** — retrait de la 1re ligne polluée `CeciEstUnTestDeCasse` ; directives conservées — statut : fait
- `[2026-07-11]` — `README.md` — **remplacé** — le template Astro par défaut → README réel (stack, structure, ajout projet, DS) — statut : fait

## 2026-07-11 (suite 4) — SEO / SEO IA + i18n commentaires

### FAIT — SEO / découvrabilité IA
- `[2026-07-11]` — `src/layouts/BaseLayout.astro` — **`lang="fr"` → `lang="en"`** (tout le contenu est en anglais ; corrige un signal SEO/a11y erroné) — statut : fait
- `[2026-07-11]` — `BaseLayout.astro` — **`<link rel="canonical">`** par page, en **URL propre** (strip du `.html` imposé par build.format:'file') → évite l'indexation en double /x et /x.html. Vérifié dans dist (home, /about, /work/*) — statut : fait
- `[2026-07-11]` — `BaseLayout.astro` — **Open Graph + Twitter Card** (og:type/site_name/title/description/url/image/locale, twitter:summary_large_image) ; nouvelles props `image` + `structuredData` — statut : fait
- `[2026-07-11]` — `BaseLayout.astro` — **JSON-LD schema.org `Person`** site-wide (nom, jobTitle « UX Product Designer », sameAs LinkedIn, image) — statut : fait
- `[2026-07-11]` — `src/pages/work/[slug].astro` — **JSON-LD `CreativeWork`** par étude de cas (name, description, url propre, image, dateCreated, creator Person, about=client) + passe description/cardImage/structuredData à BaseLayout — statut : fait
- `[2026-07-11]` — `index.astro` + `about.astro` — **meta description par page** ajoutées (accueil + about) ; titre accueil nettoyé — statut : fait
- `[2026-07-11]` — `public/llms.txt` — **créé** : résumé du site pour agents IA (identité, 3 études de cas avec liens, pages, notes) — statut : fait
- `[2026-07-11]` — `robots.txt` — **crawlers IA explicitement autorisés** (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended) ; retrait des Disallow inutiles (/dist, /node_modules non servis) — statut : fait
- `[2026-07-11]` — `BaseLayout.astro` — **`theme-color`** `#367984` (turquoise) → `#4364e8` (violet marque) — statut : fait

### i18n
- `[2026-07-11]` — **Commentaires du code FR → EN** sur 21 fichiers source (composants, pages, config, tokens, .md frontmatter). Commentaires uniquement, aucun code/contenu touché. Docs narratives (whitepaper, ce log) laissées en FR volontairement. Build OK — statut : fait
- `[2026-07-11]` — **Chaînes UI FR → EN** (passe contenu) : aria-labels (« Image précédente/suivante », « Fermer la modale », « Crédits et Références »), alt (« Image détaillée du projet », « Agrandissement… », « Aperçu du projet… »), message d'erreur Zod (config.ts), connecteur « et » → « and », role crédit « Encadrement » → « Supervision ». Noms propres (Caisse des Dépôts, École de Design) conservés. Cohérence a11y/SEO sur site anglophone. Build OK — statut : fait

### Déploiement / branches
- `[2026-07-11]` — **`deploy.yml`** : trigger `deploy/test` → `main`. Migration prod vers `main` : commit session `333f9e8`, `main` créée et poussée sur origin. Reste (côté user, UI GitHub) : définir `main` par défaut, vérifier Pages = GitHub Actions, supprimer `deploy/test` après 1er déploiement vert — statut : en cours

## 2026-07-11 (suite 3) — Tier 1 (nettoyage faible risque)

### FAIT
- `[2026-07-11]` — `src/styles/global.css` — **règle `html,body` morte supprimée** (variables CSS `--color-bg`/`--color-text` jamais définies + `font-family: system-ui` en dur redondant/concurrent). Le body est piloté par les classes tokens de BaseLayout (bg-background-page, text-text-body-primary, font-sans) — statut : fait
- `[2026-07-11]` — `package.json` — **métadonnées** : name `astro` → `portfolio-yassine-el-idrissi`, version 0.0.1 → 1.0.0, ajout description/homepage/author/license/`private: true` — statut : fait
- `[2026-07-11]` — `repomix-output.xml` — **untracké** (`git rm --cached`) + ajouté au `.gitignore` (régénérable). Fichier conservé sur disque pour usage local — statut : fait
- `[2026-07-11]` — `validate-frontmatter.cjs` — **supprimé** (cassé : dépend de gray-matter absent ; redondant avec le schéma Zod de config.ts) — statut : fait

### DETTE / À SURVEILLER
- `[2026-07-11]` — **SEO/AI à traiter (nouveau)** : pas de `<link rel="canonical">`, pas d'Open Graph / Twitter Card, pas de JSON-LD (schema.org), pas de `llms.txt`. `theme-color` dans BaseLayout encore turquoise `#367984` (marque = violet). Descriptions meta par page à vérifier.
- `[2026-07-11]` — **Branches** : prod déployée depuis `deploy/test` (nom « test » trompeur pour de la prod) ; code sur `feature/fixes`. Recommandation : basculer la prod sur `main`.
- `[2026-07-11]` — **i18n commentaires** : annotations/commentaires du code en français → à traduire en anglais (demandé, scope à confirmer : code oui ; docs FR whitepaper/log = à décider).

## 2026-07-11 (suite 2) — Audit round 2 : contenu + consolidation (Tier 2)

### FAIT
- `[2026-07-11]` — `src/content/projects/caissedesdepots.md` — **checkCdc.webp intégrée au carrousel CDC en 7e position** (avant editCdc.webp). L'image n'était pas orpheline : elle manquait juste dans le MDX. Vérifié : rendue dans dist/work/depostetconsignations.html — statut : fait
- `[2026-07-11]` — `src/content/projects/biomimicry.txt` → **`biomimicry.md` avec `isDraft: true`** — brouillon préservé, non listé et **aucune page générée** (donc n'alourdit pas le site). Frontmatter validé par Zod. Images `/images/biomimicry/*` encore absentes (à fournir avant publication) — statut : fait
- `[2026-07-11]` — `src/pages/work/[slug].astro` — **`getStaticPaths` filtre désormais les brouillons** (`data.isDraft !== true`). Corrige une incohérence latente : l'accueil filtrait les drafts mais la route détail générait quand même leurs pages — statut : fait
- `[2026-07-11]` — **Sitemap automatisé** — `@astrojs/sitemap` ajouté aux integrations d'`astro.config.mjs` ; `public/sitemap.xml` manuel **supprimé** ; `robots.txt` pointe vers `/sitemap-index.xml`. Vérifié : sitemap généré, brouillon biomimicry exclu, redirections exclues — statut : fait
- `[2026-07-11]` — **Redirections consolidées en source unique** — `public/.htaccess` **supprimé**. Le site tourne sur GitHub Pages qui ignore .htaccess ; les redirections sont générées par `astro.config.mjs` (build émet aboutme/logos/photography/projects/work.html). Vérifié : /work → /#projects intact. NB : si migration Apache un jour, restaurer .htaccess via git — statut : fait
- `[2026-07-11]` — **Polices auto-hébergées** — Google Fonts remplacé par 3 woff2 variables (sous-ensemble latin) dans `public/fonts/` : manrope-latin-var (24,8 Ko), lora-latin-var (37,8 Ko), lora-italic-latin-var (40,8 Ko) ; `@font-face` dans global.css ; preconnect/link Google retirés de BaseLayout, remplacés par 2 `preload`. Supprime la dépendance tierce render-blocking (perf + RGPD). Vérifié : 0 référence googleapis/gstatic dans dist. Sous-ensemble latin = couvre EN + FR ; ajouter latin-ext si texte d'Europe centrale — statut : fait

### DETTE / À SURVEILLER
- `[2026-07-11]` — ~~Sitemap manuel~~ → **RÉSOLU**. ~~Redirections dupliquées~~ → **RÉSOLU** (source unique astro.config.mjs). ~~Polices tierces render-blocking~~ → **RÉSOLU**. ~~biomimicry.txt inerte~~ → **RÉSOLU** (brouillon .md).
- `[2026-07-11]` — **Reste (non demandé ce jour, cf. audit round 2 Tier 1/3)** : `validate-frontmatter.cjs` (à supprimer), `repomix-output.xml` (à .gitignore), règle morte de `global.css` (var --color-bg/--color-text), `package.json` name/version, image orpheline `checkCdc` → désormais utilisée. Refactors scalabilité : `projectImages` clé/valeur, extraction de `[slug].astro`, `astro:assets`.

## 2026-07-11 (suite) — Consolidation du Design System

Consigne « ne pas toucher » **levée** par le propriétaire. Décisions validées :
BUG 1 → `text-body-primary`, BUG 2 → nouveau token `stroke-secondary` = gray-200,
architecture → **SSOT** (tokens.js pilote tailwind). Build vérifié + CSS compilé contrôlé.

### FAIT
- `[2026-07-11]` — `src/styles/tokens.js` — **restructuré en source unique de vérité** — `primitives` + couche `semantic` complète qui **référence les valeurs réelles** (plus de placeholders `"{...}"`). L'ancien bloc `semantic.colors` obsolète/divergent (turquoise) est remplacé par la carte sémantique OPÉRATIONNELLE (violet `accent-action`). Valeurs conservées à l'identique → 0 changement visuel — statut : fait
- `[2026-07-11]` — `tailwind.config.mjs` — **consomme `...tokens.semantic.colors`** au lieu du mapping écrit à la main — élimine la double source / divergence définitivement — statut : fait
- `[2026-07-11]` — `src/styles/tokens.js` — **palettes mortes supprimées** : `blue-chill` (0 usage) et `accent-deco` (identique à `accent-action`) — statut : fait
- `[2026-07-11]` — `src/components/Cloud.astro` — `tokens.primitives.color["accent-deco"][shade]` → `["accent-action"][shade]` (dédup ; valeurs identiques, 0 changement visuel). NB : Cloud consomme le token en **JS direct**, pas via classe Tailwind — d'où l'invisibilité au scan de classes — statut : fait
- `[2026-07-11]` — tokens morts retirés du mapping : `accent-deco-*`, `decoration-brand` (0 usage) — statut : fait
- `[2026-07-11]` — **BUG 1 corrigé** — `src/pages/work/[slug].astro` : classe `text-text-body` (token inexistant, corps de texte des études de cas rendu en couleur héritée) → `text-text-body-primary` (11 occurrences) — statut : fait
- `[2026-07-11]` — **BUG 2 corrigé** — token `stroke-secondary` (gray-200 #e5e7eb) créé ; les séparateurs de `Footer.astro` + `about.astro` (`border-stroke-secondary`, 5 usages) rendaient en `currentColor` (foncé) → désormais gris clair — statut : fait

Vérification CSS compilé : `border-stroke-secondary` = rgb(229 231 235) ✓ · `text-text-body-primary` = rgb(3 7 18) ✓ · brand toujours violet #4364e8, 0 occurrence turquoise ✓.

- `[2026-07-11]` — `Whitepaper d'architecture — …txt` — **ACTION LOG interne + changelog navbar supprimés** (75 lignes) au profit de ce fichier `MAINTENANCE_LOG.md` séparé ; pointeur ajouté en fin de whitepaper — statut : fait
- `[2026-07-11]` — `Whitepaper d'architecture — …txt` — **contenu réconcilié avec l'état réel** (devient source de vérité vivante) : en-tête (repo `yeldrs/portfolio_2026`, statut « document vivant »), §2.1 (11 composants, tokens.js SSOT, .htaccess dormant), §3.1 (retrait Welcome/ContactFormSection, ajout Cloud), §3.4 (items traités retirés, pending réel listé), §4.1-4.3 (chaîne SSOT, brand violet accent-action, avertissement « double source » remplacé par la règle source unique), §6.5 (hébergement clarifié : GitHub Pages + Hostinger registrar/email), §7 renuméroté 7.1→7.8 (items résolus retirés, cross-refs corrigés), Annexe (pièges résiduels + points résolus) — statut : fait

### DETTE / À SURVEILLER (constaté, non corrigé)
- `[2026-07-11]` — ~~Design System double source / palettes dupliquées~~ → **RÉSOLU** (voir ci-dessus).
- `[2026-07-11]` — **`src/styles/global.css`** — la règle `html,body { background-color: var(--color-bg); color: var(--color-text); }` référence des variables CSS **jamais définies** → règle inopérante (le fond réel vient de `bg-background-page` dans BaseLayout). De plus `font-family: system-ui` y est posé en dur (peut concurrencer la police Manrope). À nettoyer/aligner sur les tokens. Non touché ce jour (hors périmètre couleurs).
- `[2026-07-11]` — **Ambiguïté de déploiement.** `.htaccess`/`CNAME` (Apache) coexistent avec `deploy.yml` (GitHub Pages, branche `deploy/test`). Redirections dupliquées dans `astro.config.mjs` ET `.htaccess`. → Trancher définitivement l'hébergeur, puis retirer la config de l'autre.
- `[2026-07-11]` — **Sitemap manuel.** `@astrojs/sitemap` est installé (devDeps) mais absent des `integrations` d'`astro.config.mjs`. `public/sitemap.xml` est écrit à la main → à mettre à jour à chaque projet. Activer l'intégration automatiserait.
- `[2026-07-11]` — **`validate-frontmatter.cjs`** — non branché à npm, dépend de `gray-matter` (absent de `package.json`) → actuellement non fonctionnel. Le schéma Zod de `config.ts` couvre déjà la validation au build. Candidat suppression ou documentation comme outil manuel (reporté).
- `[2026-07-11]` — **`src/content/projects/biomimicry.txt`** — brouillon de projet en `.txt` (non chargé par la Content Collection, qui ne lit que `.md`/`.mdx`) ; référence une image inexistante `coverProject-biomimicry.webp`. Conservé (contenu potentiel du propriétaire) → à convertir en `.md` avec `isDraft: true` ou supprimer.
- `[2026-07-11]` — **`repomix-output.xml`** (126 Ko) + `repomix.config.json` versionnés — snapshot régénérable pour contexte IA. Alourdit le repo. Envisager `.gitignore` (régénérable via repomix).
- `[2026-07-11]` — **Mapping d'images positionnel** (`projectImages` index 0/2/4/6/8+) dans les `.md` — fragile, un décalage casse la mise en page sans erreur de build. Conserver les positions vides `""`. Refactor clé/valeur souhaitable à terme.
- `[2026-07-11]` — **`src/pages/work/[slug].astro`** — gabarit dense. Si les études de cas se complexifient, extraire les sections répétées (Diagnosis/Conception/Results) en sous-composants.
