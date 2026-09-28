"""Team Notes backend: a tiny JSON API plus the static frontend."""

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, abort, jsonify, request, send_from_directory

ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = ROOT / "frontend"
DATA_FILE = Path(__file__).resolve().parent / "notes.json"

app = Flask(__name__, static_folder=None)


def load_notes():
    if not DATA_FILE.exists():
        return []
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def save_notes(notes):
    DATA_FILE.write_text(json.dumps(notes, indent=2), encoding="utf-8")


# ---- API ----

@app.get("/api/notes")
def list_notes():
    return jsonify(load_notes())


@app.post("/api/notes")
def create_note():
    body = request.get_json(silent=True) or {}
    text = (body.get("text") or "").strip()
    author = (body.get("author") or "").strip() or "anonymous"
    if not text:
        return jsonify(error="text is required"), 400

    note = {
        "id": uuid.uuid4().hex[:8],
        "text": text[:500],
        "author": author[:40],
        "created": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    notes = load_notes()
    notes.insert(0, note)
    save_notes(notes)
    return jsonify(note), 201


@app.delete("/api/notes/<note_id>")
def delete_note(note_id):
    notes = load_notes()
    remaining = [n for n in notes if n["id"] != note_id]
    if len(remaining) == len(notes):
        abort(404)
    save_notes(remaining)
    return "", 204


# ---- Frontend ----

@app.get("/")
def index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/<path:filename>")
def static_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
