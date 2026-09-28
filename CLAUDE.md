# Team Notes: guide for Claude Code

A small practice project (Flask backend + plain HTML/CSS/JS frontend) used to learn
Git and GitHub teamwork. See README.md for how to run it and GIT_GUIDE.md for the
full Git workflow.

## Project layout
- `backend/app.py`: Flask server. JSON API under `/api/notes`, also serves `frontend/`.
- `frontend/`: `index.html`, `style.css`, `app.js` (no build step).
- `backend/notes.json`: local data, git-ignored. Never commit it.

## Run and test
- Python virtualenv lives in `.venv/`. Start the site with
  `.venv\Scripts\python.exe backend\app.py`, then open http://127.0.0.1:5000.
- There are no automated tests yet. Before committing a change, open the site and
  check that adding and deleting a note still works and that the note counter updates.

## Git rules for this repo
- `main` is protected on GitHub: every change goes through a pull request.
  Never commit directly to `main` and never force-push.
- Start each piece of work from an up-to-date `main`:
  `git switch main`, `git pull`, then `git switch -c <branch>`.
- Branch names: `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`.
- One topic per branch and per commit. Commit messages are short, in the imperative
  ("Add note counter", not "added stuff").
- Stage files by name. Don't use `git add .` without first checking `git status`.
- PR descriptions say what changed and how it was tested.
- After a PR is merged: switch to `main`, `git pull --prune`, delete the local branch
  with `git branch -d`.
- Ask the user before merging a PR, deleting branches, rewriting history
  (`reset`, `rebase`), or anything that affects GitHub beyond pushing a branch.

## Environment notes (Windows)
- Shell is PowerShell. Quote arguments containing `@` or `{}`, e.g. `"HEAD@{1}"`.
- The GitHub CLI is at `C:\Program Files\GitHub CLI\gh.exe` if `gh` isn't on PATH
  (it was installed after the app was opened; restarting the app fixes this).
- The repo is `Yasir164/git-practice` on GitHub.
