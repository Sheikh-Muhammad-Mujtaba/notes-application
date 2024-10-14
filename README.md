# Note Taker App

A **Note Taker App** built with **Next.js** and **Tailwind CSS** to manage and organize notes with features like dark mode toggle, note pinning, and more.

## Features

- **Dark Mode Toggle**: Switch between light and dark themes.
- **Note Pinning**: Pin important notes to keep them at the top.
- **Note Editing**: Edit your existing notes easily.
- **Note Deletion**: Remove notes when no longer needed.
- **Responsive Design**: Works across various screen sizes.

## Technologies Used

- **Next.js**: A React framework for building optimized web applications.
- **Tailwind CSS**: A utility-first CSS framework to design clean UIs.
- **Lucide-React**: Icons used for note management UI (edit, delete, and pin).
- **LocalStorage**: Used to persist notes data across page reloads.

## Usage

1. **Add a Note**: Fill in the title and content fields, then click "Add Note" to save it.
2. **Edit a Note**: Click the edit icon (✏️) to modify an existing note.
3. **Delete a Note**: Click the trash icon (🗑️) to remove a note.
4. **Pin/Unpin a Note**: Click the pin icon (📍/📌) to toggle pinning.
5. **Dark Mode**: Use the moon/sun icon (🌙/☀️) in the header to toggle dark mode.


## How It Works

1. **Note State**: Notes are stored in a state variable and initialized from `localStorage`.
2. **Add/Update/Delete Notes**: Notes can be created, updated, or removed via corresponding functions (`handleAddNote`, `handleUpdateNote`, `handleDeleteNote`).
3. **Pinning**: Notes can be pinned or unpinned using the `togglePinNote` function. Pinned notes are shown at the top.
4. **Dark Mode**: Managed using a state that toggles CSS classes for dark and light themes.

