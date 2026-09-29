const list = document.getElementById("notes");
const form = document.getElementById("note-form");
const errorBox = document.getElementById("error");
const search = document.getElementById("search");
let allNotes = [];

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const notes = query
    ? allNotes.filter((n) => `${n.text} ${n.author}`.toLowerCase().includes(query))
    : allNotes;

  const total = `${allNotes.length} note${allNotes.length === 1 ? "" : "s"}`;
  document.getElementById("count").textContent = query ? `${notes.length} of ${total}` : total;

  list.innerHTML = "";
  if (notes.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = query ? `No notes match "${search.value.trim()}".` : "No notes yet — add the first one.";
    list.append(empty);
    return;
  }
  for (const note of notes) {
    const li = document.createElement("li");

    const p = document.createElement("p");
    p.textContent = note.text;

    const meta = document.createElement("div");
    meta.className = "meta";
    const who = document.createElement("span");
    who.textContent = `${note.author} · ${new Date(note.created).toLocaleString()}`;
    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Delete";
    del.onclick = () => deleteNote(note.id);
    meta.append(who, del);

    li.append(p, meta);
    list.append(li);
  }
}

async function loadNotes() {
  const res = await fetch("/api/notes");
  allNotes = await res.json();
  render();
}

async function deleteNote(id) {
  await fetch(`/api/notes/${id}`, { method: "DELETE" });
  loadNotes();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author: document.getElementById("author").value,
      text: document.getElementById("text").value,
    }),
  });
  if (!res.ok) {
    showError((await res.json()).error || "Could not save the note.");
    return;
  }
  showError("");
  document.getElementById("text").value = "";
  loadNotes();
});

search.addEventListener("input", render);

loadNotes();
