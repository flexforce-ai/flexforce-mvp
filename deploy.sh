#!/usr/bin/env bash
# FlexForce MVP — one-shot deploy script
# Creates a GitHub repo under flexforce-ai/ and ships to Vercel production.

set -e

# ─── Config ────────────────────────────────────────────────────────────────────
GH_ORG="flexforce-ai"
REPO_NAME="flexforce-mvp"
REPO_DESC="FlexForce.ai — landing page + sample apply page MVP. Built by Jack."
VISIBILITY="public"   # change to "private" if you'd rather start private

# ─── Pretty output ─────────────────────────────────────────────────────────────
green() { printf '\033[0;32m%s\033[0m\n' "$1"; }
yellow() { printf '\033[1;33m%s\033[0m\n' "$1"; }
red() { printf '\033[0;31m%s\033[0m\n' "$1"; }

# ─── Pre-flight ────────────────────────────────────────────────────────────────
yellow "▸ Pre-flight checks…"

if ! command -v gh >/dev/null 2>&1; then
  red "✗ GitHub CLI (gh) not found."
  echo "  Install:  brew install gh"
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  red "✗ Vercel CLI not found."
  echo "  Install:  npm i -g vercel  (or: brew install vercel-cli)"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  red "✗ Not logged in to GitHub."
  echo "  Run:  gh auth login"
  exit 1
fi

# Verify org membership / access
if ! gh api "orgs/$GH_ORG" >/dev/null 2>&1; then
  red "✗ Cannot access org '$GH_ORG'. Either it doesn't exist yet or your gh user isn't a member."
  echo "  Create the org at https://github.com/account/organizations/new (free)"
  echo "  Then re-run this script."
  exit 1
fi

green "✓ All pre-flight checks passed."
echo

# ─── Git init ──────────────────────────────────────────────────────────────────
yellow "▸ Initializing git repository…"
if [ ! -d .git ]; then
  git init -b main
  git add .
  git commit -m "Initial commit — FlexForce landing + sample apply MVP"
  green "✓ Local repo initialized."
else
  yellow "  (git already initialized — committing any new changes)"
  git add .
  git diff-index --quiet HEAD || git commit -m "Update site files"
fi
echo

# ─── GitHub create + push ──────────────────────────────────────────────────────
yellow "▸ Creating GitHub repo '$GH_ORG/$REPO_NAME' ($VISIBILITY)…"

if gh repo view "$GH_ORG/$REPO_NAME" >/dev/null 2>&1; then
  yellow "  Repo already exists. Adding as 'origin' if not present, then pushing."
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "git@github.com:$GH_ORG/$REPO_NAME.git"
  git push -u origin main
else
  gh repo create "$GH_ORG/$REPO_NAME" \
    --"$VISIBILITY" \
    --description "$REPO_DESC" \
    --source=. \
    --remote=origin \
    --push
fi

green "✓ Pushed to https://github.com/$GH_ORG/$REPO_NAME"
echo

# ─── Vercel deploy ─────────────────────────────────────────────────────────────
yellow "▸ Deploying to Vercel production…"

if [ ! -f .vercel/project.json ]; then
  echo "  (first deploy — Vercel will ask you a few questions)"
  vercel --prod --yes 2>/dev/null || vercel --prod
else
  vercel --prod
fi

echo
green "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
green "✓ Deploy complete."
green "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
yellow "Next steps:"
echo "  1. Connect flexforce.ai as the custom domain:"
echo "     vercel domains add flexforce.ai"
echo "     (or do it in the Vercel dashboard → Settings → Domains)"
echo
echo "  2. Activate FormSubmit by submitting the form once and"
echo "     clicking the confirmation link in jack@flexforce.ai inbox."
echo
echo "  3. Post Variant 1 from nextdoor.md to your neighborhood."
echo
