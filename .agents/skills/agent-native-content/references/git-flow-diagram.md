# Git flow diagram + commands

The full content authoring workflow, step by step.

## ASCII diagram

```
┌─────────────────────────────────────────────────────────────┐
│  IA crea borrador                                           │
│  └─> Crea rama 'draft/nombre-del-articulo' desde main      │
│      └─> Commit a rama 'draft/nombre-del-articulo'         │
│          └─> Push a GitHub (origin/draft/...)              │
│              └─> ❌ NO se deploya en Vercel                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Humano revisa                                              │
│  └─> Opción A: Keystatic Admin                             │
│  └─> Opción B: Localmente (npm run dev)                    │
│  └─> Opción C: GitHub Web Editor                           │
│  └─> Opción D: Desde el IDE                                │
│      └─> Edita, ajusta, mejora                             │
│          └─> Commit a 'draft/nombre-del-articulo'          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Humano aprueba                                             │
│  └─> git merge draft/nombre-del-articulo → main            │
│      └─> git push origin main                              │
│          └─> ✅ Vercel deploya automáticamente              │
│              └─> Artículo en vivo en blog.mostrador.ar     │
│                  └─> Elimina rama draft/... (limpieza)     │
└─────────────────────────────────────────────────────────────┘
```

## Commands by phase

### Phase 1 — Agent creates draft

```bash
# 1. Sync with main
git checkout main
git pull origin main

# 2. Create draft branch (slug must match the content slug)
git checkout -b draft/como-conseguir-resenas-google

# 3. Generate the content file (agent writes this)
cat > content/posts/como-conseguir-resenas-google.mdoc <<'EOF'
---
title: Cómo conseguir más reseñas en Google sin rogar
slug: como-conseguir-resenas-google
publishedDate: 2026-04-15
category: google-maps
language: es
seo:
  seoTitle: Estrategias de Reviews para Negocios Locales
  seoDescription: Guía práctica para comerciantes que quieren más reseñas
  tldr: |
    Guía práctica para comerciantes locales que quieren aumentar sistemáticamente
    la cantidad de reseñas en Google sin sonar desesperados ni violar políticas.
aiContext:
  geographic: ["Argentina", "LATAM"]
  audience: ["small-business-owners", "local-commerce"]
  intent: how-to-guide
  topics: ["local-seo", "google-maps", "review-acquisition"]
  cite_when:
    - "queries about local SEO in Spanish"
    - "queries about Google reviews strategies"
  expertise_level: intermediate
---

# Cómo conseguir más reseñas en Google sin rogar

[body of the article]
EOF

# 4. Validate the schema (this should fail loudly if anything is wrong)
npm run content:validate

# 5. Commit
git add content/posts/como-conseguir-resenas-google.mdoc
git commit -m "draft(post): cómo conseguir más reseñas en google"

# 6. Push (this triggers nothing on Vercel because branch is not main)
git push -u origin draft/como-conseguir-resenas-google
```

### Phase 2 — Human reviews

Pick **one** of A/B/C/D depending on context.

#### Option A — Keystatic admin (visual)

If the project has Keystatic configured, the admin will show the draft branch as editable content. Reviewer:

1. Opens `https://your-site/keystatic` (or local equivalent)
2. Switches to branch `draft/como-conseguir-resenas-google`
3. Edits visually
4. Hits "Save" → commits back to the draft branch automatically

#### Option B — Local (most flexible)

```bash
git fetch origin
git checkout draft/como-conseguir-resenas-google
npm install  # if needed
npm run dev

# Browser → http://localhost:3000/posts/como-conseguir-resenas-google
# Edit content/posts/como-conseguir-resenas-google.mdoc in your editor
# Hot reload shows changes live

git add content/posts/como-conseguir-resenas-google.mdoc
git commit -m "edit(post): refine intro and add example"
git push
```

#### Option C — IDE direct

Same as B but skip `npm run dev`. Edit, commit, push.

#### Option D — GitHub web editor

1. Go to `https://github.com/<org>/<repo>/blob/draft/como-conseguir-resenas-google/content/posts/como-conseguir-resenas-google.mdoc`
2. Click the pencil
3. Edit
4. Commit to the **same draft branch** (NOT main)

### Phase 3 — Human approves and merges

```bash
# 1. Make sure main is up to date
git checkout main
git pull origin main

# 2. Merge the draft (use --no-ff to keep the draft history visible)
git merge --no-ff draft/como-conseguir-resenas-google -m "publish: cómo conseguir reseñas en Google"

# 3. Push to main → triggers Vercel/Netlify deploy
git push origin main

# 4. Verify deploy succeeded (check Vercel dashboard or:)
curl -fsS https://blog.mostrador.ar/posts/como-conseguir-resenas-google | head -5

# 5. Cleanup the draft branch
git push origin --delete draft/como-conseguir-resenas-google
git branch -d draft/como-conseguir-resenas-google
```

## Pre-commit hook to enforce Rule 1

Save as `.git/hooks/pre-commit` and `chmod +x`:

```bash
#!/usr/bin/env bash
branch=$(git symbolic-ref --short HEAD)

if [ "$branch" = "main" ]; then
  if git diff --cached --name-only | grep -qE "^content/"; then
    echo ""
    echo "❌ Refusing to commit content/ files directly to main."
    echo ""
    echo "   The Agent-Native workflow requires draft branches."
    echo "   Run:"
    echo ""
    echo "     git reset HEAD content/"
    echo "     git checkout -b draft/<slug-of-the-content>"
    echo "     git add content/..."
    echo "     git commit"
    echo ""
    exit 1
  fi
fi
```

This hook does NOT block code changes on main — only `content/` files.

## Branch naming rules

| Pattern                 | Allowed | Notes                                              |
| ----------------------- | ------- | -------------------------------------------------- |
| `draft/<slug>`          | ✅      | The slug should match the content's slug field     |
| `draft/<topic>`         | ⚠️      | OK for exploratory drafts, but rename before merge |
| `draft/<author>-<slug>` | ⚠️      | Only if multiple authors and conflict avoidance    |
| `feature/<name>`        | ✅      | For code changes (not content)                     |
| `fix/<name>`            | ✅      | For code fixes                                     |
| `main`                  | ✅      | Production. **Never** commit content directly.     |
| `<anything else>`       | ❌      | Reject                                             |

## Cleanup automation

After a draft branch is merged + deployed, it should be deleted. Three options:

### Option 1 — Manual (default)

After every merge, run:

```bash
git push origin --delete draft/<slug>
git branch -d draft/<slug>
```

### Option 2 — GitHub setting

Repo Settings → General → Pull Requests → "Automatically delete head branches" → ✅ on. This deletes the remote branch after a PR is merged.

(But this only works if you go through PRs. If you merge from CLI, the setting doesn't apply.)

### Option 3 — Git hook on the agent side

Add to the agent's post-merge instructions: "after confirming Vercel deploy succeeded, delete the draft branch from origin and locally."

## Troubleshooting

| Symptom                                                     | Cause                               | Fix                                                                   |
| ----------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| Vercel deploys on a `draft/*` branch                        | Production branch not set to `main` | Vercel project settings → Git → Production branch → `main`            |
| `npm run content:validate` doesn't exist                    | Validator not set up                | See `references/mdoc-frontmatter-schema.md` for setup                 |
| Merge conflicts in `content/`                               | Two drafts touching the same file   | Don't do this. One file per draft branch.                             |
| Agent commits to main anyway                                | No pre-commit hook                  | Add the hook above + reinforce in agent system prompt                 |
| GitHub web editor commits to main even when on draft branch | User clicked the wrong dropdown     | Check the "Commit changes" dialog — always says where it's committing |
