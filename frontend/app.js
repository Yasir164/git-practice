const list = document.getElementById("notes");
const form = document.getElementById("note-form");
const errorBox = document.getElementById("error");

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

function render(notes) {
  document.getElementById("count").textContent = `${notes.length} note${notes.length === 1 ? "" : "s"}`;
  list.innerHTML = "";
  if (notes.length === 0) {
    list.innerHTML = '<li class="empty">No notes yet — add the first one.</li>';
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
  render(await res.json());
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

loadNotes();
