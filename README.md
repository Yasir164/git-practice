# Team Notes

A deliberately small website (Flask backend + plain HTML/CSS/JS frontend) used to
practise working on one project with several people through GitHub.

```
team-notes/
├── backend/
│   ├── app.py            # Flask server: JSON API + serves the frontend
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js            # calls the API with fetch()
├── README.md
└── GIT_GUIDE.md          # how to commit, push, pull, branch, PR — VS Code & Claude Code
```

## Run it locally

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows  (macOS/Linux: source .venv/bin/activate)
pip install -r backend/requirements.txt
python backend/app.py
```

Open http://127.0.0.1:5000

## API

| Method | Path               | What it does        |
|--------|--------------------|---------------------|
| GET    | `/api/notes`       | list notes          |
| POST   | `/api/notes`       | add `{text, author}`|
| DELETE | `/api/notes/<id>`  | delete a note       |

Notes are stored in `backend/notes.json`, which is git-ignored, so each person has their own data.

## Working together

See [GIT_GUIDE.md](GIT_GUIDE.md).
