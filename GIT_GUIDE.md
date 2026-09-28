# Git & GitHub Team Guide

How several people work on this project at the same time, and how to do every
common Git action three ways: **VS Code buttons**, **terminal commands**, and
**Claude Code** (just ask in plain English).

---

## 1. The big picture

```
 Your laptop                        GitHub (shared)               Teammate's laptop
┌───────────────┐   git push    ┌──────────────────┐   git pull  ┌───────────────┐
│ working files │ ────────────▶ │  origin/main     │ ──────────▶ │ working files │
│  + local repo │ ◀──────────── │  + branches      │ ◀────────── │  + local repo │
└───────────────┘   git pull    │  + Pull Requests │   git push  └───────────────┘
                                └──────────────────┘
```

| Word | Meaning |
|------|---------|
| **repository (repo)** | the project folder plus its full history (`.git/` folder) |
| **commit** | a saved snapshot of your changes, with a message |
| **branch** | a separate line of work; `main` is the shared, "good" version |
| **remote / origin** | the copy on GitHub |
| **push** | upload your commits to GitHub |
| **pull** | download others' commits from GitHub and merge them into yours |
| **fetch** | download without merging (just "see what's new") |
| **Pull Request (PR)** | a request on GitHub to merge your branch into `main`, where teammates review it |
| **merge conflict** | two people changed the same lines; Git asks you to choose |

**Golden rule for teams:** never commit straight to `main`. Make a branch → commit → push → open a PR → review → merge.

---

## 2. One-time setup

### Everyone
1. Install Git (done) and tell it who you are:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```
2. Have a GitHub account.

### The project owner (once)
1. On github.com → **New repository** → name `team-notes` → **don't** tick "Add README" (we have one) → Create.
2. Connect this folder and upload it:
   ```bash
   git remote add origin https://github.com/<your-username>/team-notes.git
   git push -u origin main
   ```
3. Invite teammates: repo → **Settings → Collaborators → Add people**.
4. (Recommended) Protect `main`: **Settings → Branches → Add rule** → `main` →
   tick *Require a pull request before merging*.

### Each teammate (once)
```bash
git clone https://github.com/<owner>/team-notes.git
cd team-notes
```
VS Code: **Ctrl+Shift+P → "Git: Clone"** → paste the URL.
Claude Code: *"clone https://github.com/<owner>/team-notes.git into D:\projects"*.

The first push/pull will open a browser window to sign in to GitHub — that's normal.

---

## 3. The daily workflow

| Step | Terminal | VS Code (Source Control panel, `Ctrl+Shift+G`) | Claude Code (just say…) |
|------|----------|-----------------------------------------------|-------------------------|
| Get latest `main` | `git switch main` then `git pull` | bottom-left branch name → `main`; then **…→ Pull** (or the ⟳ sync icon) | "switch to main and pull the latest" |
| Start a branch | `git switch -c feature/dark-button` | bottom-left branch name → **Create new branch** | "create a branch called feature/dark-button" |
| See what changed | `git status` / `git diff` | files listed under *Changes*; click one to see the diff | "what have I changed?" |
| Stage files | `git add frontend/app.js` or `git add .` | **+** next to a file (or next to *Changes* for all) | (Claude stages for you when committing) |
| Commit | `git commit -m "Add dark mode button"` | type message in the box → **✓ Commit** | "commit this with a good message" |
| Push | `git push -u origin feature/dark-button` (first time), then `git push` | **Publish Branch** / **Sync Changes** | "push my branch" |
| Open a PR | on github.com: **Compare & pull request** | GitHub Pull Requests extension → **Create PR** | "open a pull request for this branch" *(needs the `gh` CLI)* |
| Review & merge | on github.com: **Files changed → Review → Merge** | GitHub Pull Requests extension | "review PR #3" / "merge PR #3" |
| Update after merge | `git switch main` → `git pull` | switch to main → Sync | "switch to main and pull" |
| Delete old branch | `git branch -d feature/dark-button` and `git push origin --delete feature/dark-button` | **…→ Branch → Delete Branch** | "delete the feature/dark-button branch locally and on GitHub" |

---

## 4. Other things you'll need

### Undo / delete
| Want to… | Terminal | VS Code |
|----------|----------|---------|
| Throw away unsaved edits to one file | `git restore app.js` | right-click file → **Discard Changes** |
| Unstage a file (keep the edits) | `git restore --staged app.js` | **−** next to the staged file |
| Undo the last commit, keep the changes | `git reset --soft HEAD~1` | **…→ Commit → Undo Last Commit** |
| Undo a commit that's already pushed (safe) | `git revert <commit-id>` | right-click commit in *Graph* → Revert |
| Delete a file and record it | `git rm old.txt` then commit | delete in Explorer, then commit |

⚠️ Avoid `git push --force` on shared branches — it rewrites history your teammates already have.

### History
`git log --oneline --graph --all` · VS Code: **Source Control → Graph** (or the *Timeline* view per file).

### Keeping your branch up to date with `main`
```bash
git switch main && git pull
git switch feature/dark-button
git merge main
```

---

## 5. Merge conflicts (they will happen!)

When two people edit the same lines, Git stops and marks the file:

```
<<<<<<< HEAD
<h1>Team Notes</h1>
=======
<h1>Our Notes Board</h1>
>>>>>>> main
```

- **VS Code:** click *Accept Current* / *Accept Incoming* / *Accept Both*, or use the **Merge Editor**, then stage + commit.
- **Terminal:** edit the file to the final version, remove the `<<<< ==== >>>>` lines, then `git add <file>` and `git commit`.
- **Claude Code:** "I have a merge conflict, help me resolve it" — it will show you both sides and ask which to keep.

---

## 6. Using Claude Code with Git — tips

- Claude runs the same `git` commands you would; you'll see each one and can approve it.
- It commits or pushes **only when you ask**, and asks before risky things (force-push, deleting branches, resetting).
- For PRs, reviews and merges from Claude, install the **GitHub CLI** (`winget install GitHub.cli`, then `gh auth login`).
- Handy prompts:
  - "Summarise what changed on this branch compared to main"
  - "Write a commit message for my staged changes"
  - "Open a PR and describe the changes"
  - "/code-review" – review your changes before you push

## 7. Recommended VS Code extensions
- **GitHub Pull Requests** (GitHub.vscode-pull-request-github) – create/review/merge PRs inside VS Code
- **GitLens** (optional) – who changed each line, and when

---

## 8. Practice exercise for the team

1. Person A: branch `feature/note-count`, show "N notes" above the list (`frontend/app.js`), push, open PR.
2. Person B: branch `feature/title`, change the `<h1>` text, push, open PR.
3. Person C: branch `feature/title-2`, *also* change the `<h1>` → merge after B → **resolve the conflict**.
4. Review each other's PRs on GitHub, merge, then everyone pulls `main`.
5. Delete the merged branches.
