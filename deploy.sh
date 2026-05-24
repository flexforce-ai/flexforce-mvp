#!/usr/bin/env bash
# FlexForce MVP — one-time setup script.
# Creates the GitHub repo, pushes initial code, links Vercel, and points you
# to the next steps for environment variables + GitHub integration.
#
# After this runs once, your daily workflow is simply: git add . && git commit && git push
# Vercel auto-deploys on every push to main.

set -e

# ─── Config ────────────────────────────────────────────────────────────────────
GH_ORG="flexforce-ai"
REPO_NAME="flexforce-mvp"
REPO_DESC="FlexForce.ai — landing page, sample apply page, and signup API. Built by Jack."
VISIBILITY="public"   # change to "private" if preferred

# ─── Pretty output ─────────────────────────────────────────────────────────────
green() { printf '\033[0;32m%s\033[0m\n' "$1"; }
yellow() { printf '\033[1;33m%s\033[0m\n' "$1"; }
red() { printf '\033[0;31m%s\033[0m\n' "$1"; }
cyan() { printf '\033[0;36m%s\033[0m\n' "$1"; }

# ─── Pre-flight ────────────────────────────────────────────────────────────────
yellow "▸ Pre-flight checks…"

if ! command -v gh >/dev/null 2>&1; then
  red "✗ GitHub CLI (gh) not found."
  echo "  Install:  brew install gh"
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  red "✗ Vercel CLI not found."
  echo "  Install:  npm i -g vercel"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  red "✗ Not logged in to GitHub."
  echo "  Run:  gh auth login"
  exit 1
fi

if ! gh api "orgs/$GH_ORG" >/dev/null 2>&1; then
  red "✗ Cannot access org '$GH_ORG'."
  echo "  Either it doesn't exist yet or your gh user isn't a member."
  echo "  Create the org (free) at https://github.com/account/organizations/new"
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
  git commit -m "Initial commit — FlexForce landing + apply + signup API"
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

# ─── Vercel link ───────────────────────────────────────────────────────────────
yellow "▸ Linking this folder to your Vercel project…"
echo "  (Vercel will ask: scope/team, link to existing project? Pick 'flexforce-mvp')"
echo

if [ ! -d .vercel ]; then
  vercel link
else
  yellow "  .vercel/ already exists — skipping link step."
fi

green "✓ Vercel project linked."
echo

# ─── Done — print next steps ───────────────────────────────────────────────────
green "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
green "✓ Initial setup complete."
green "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
cyan "Next steps (one-time, ~10 minutes):"
echo
echo "1) Add your environment variables to Vercel. Run each of these,"
echo "   paste the value when prompted, and pick 'Production' (then optionally"
echo "   re-run with 'Preview' so preview deploys also work):"
echo
echo "      vercel env add RESEND_API_KEY"
echo "      vercel env add TURNSTILE_SECRET_KEY"
echo "      vercel env add JACK_EMAIL"
echo "      vercel env add CAL_LINK"
echo "      vercel env add MAIL_FROM_JACK"
echo "      vercel env add MAIL_FROM_SIGNUPS"
echo
echo "   (See .env.example for what each one is and where to get it.)"
echo
echo "2) Connect this GitHub repo for auto-deploy on push:"
echo "      https://vercel.com/dashboard → your project → Settings → Git"
echo "      Click 'Connect Git Repository' and pick '$GH_ORG/$REPO_NAME'"
echo
echo "3) Replace the Turnstile site key in index.html:"
echo "      Find:    data-sitekey=\"1x00000000000000000000AA\""
echo "      Replace: with your real Turnstile site key from Cloudflare"
echo "      Then:    git add index.html && git commit -m 'Add real Turnstile key' && git push"
echo
echo "4) Trigger your first real deploy with all env vars active:"
echo "      git commit --allow-empty -m 'Trigger deploy with env vars' && git push"
echo
green "From this point on, your deploy workflow is just:"
echo
echo "      git add ."
echo "      git commit -m \"your message\""
echo "      git push"
echo
green "Vercel auto-deploys every push. Done."
