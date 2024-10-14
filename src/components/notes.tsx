"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilePenIcon, TrashIcon } from "lucide-react";
import DarkModeToggle from "@/components/Darkmode-button";

// Define the Note type
type Note = {
    id: number;
    title: string;
    content: string;
    pinned: boolean;
};

// Default notes to initialize the app with
const defaultNotes: Note[] = [
    {
        id: 1,
        title: "Grocery List",
        content: "Milk, Eggs, Bread, Apples",
        pinned: false,
    },
    {
        id: 2,
        title: "Meeting Notes",
        content: "Discuss new project timeline, assign tasks to team",
        pinned: false,
    },
    {
        id: 3,
        title: "Idea for App",
        content: "Develop a note-taking app with a clean and minimalist design",
        pinned: false,
    },
];

// Custom hook to manage localStorage with state
function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store the value
    const [storedValue, setStoredValue] = useState<T>(initialValue);


    // useEffect to load stored value from localStorage when the component mounts
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const item = window.localStorage.getItem(key);
                if (item) {
                    setStoredValue(JSON.parse(item));
                }
            } catch (error) {
                console.error(error);
            }
        }
    }, [key]);

    // Function to set a new value both in state and localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue] as const;
}

export default function NotesApp() {
    // State to manage notes using localStorage
    const [notes, setNotes] = useLocalStorage<Note[]>("notes", defaultNotes);
    // State to manage new note input
    const [newNote, setNewNote] = useState<{ title: string; content: string; pinned: boolean }>({
        title: "",
        content: "",
        pinned: false,
    });
    // State to manage the ID of the note being edited
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    // State to check if the component is mounted
    const [isMounted, setIsMounted] = useState<boolean>(false);

    // useEffect to set the component as mounted
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Function to handle adding a new note
    const handleAddNote = (): void => {
        if (newNote.title.trim() && newNote.content.trim()) {
            const newNoteWithId = { id: Date.now(), ...newNote };
            setNotes([...notes, newNoteWithId]);
            setNewNote({ title: "", content: "", pinned: false });
        }
    };

    // Function to handle editing a note
    const handleEditNote = (id: number): void => {
        const noteToEdit = notes.find((note) => note.id === id);
        if (noteToEdit) {
            setNewNote({ title: noteToEdit.title, content: noteToEdit.content, pinned: noteToEdit.pinned });

            setEditingNoteId(id);
        }
    };

    // Function to handle updating a note
    const handleUpdateNote = (): void => {
        if (newNote.title.trim() && newNote.content.trim()) {
            setNotes(
                notes.map((note) =>
                    note.id === editingNoteId
                        ? { id: note.id, title: newNote.title, content: newNote.content, pinned: newNote.pinned }
                        : note
                )
            );
            setNewNote({ title: "", content: "", pinned: false });

            setEditingNoteId(null);
        }
    };

    // Function to handle deleting a note
    const handleDeleteNote = (id: number): void => {
        setNotes(notes.filter((note) => note.id !== id));
    };

    // Return null if the component is not mounted to avoid SSR issues
    if (!isMounted) {
        return null;
    }

    // Function to toggle note pinning
    const togglePinNote = (id: number): void => {
        setNotes(
            notes.map((note) =>
                note.id === id ? { ...note, pinned: !note.pinned } : note
            )
        );
    };
    const sortedNotes = [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned));


    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <header className="flex  justify-between bg-muted p-4 shadow dark:bg-gray-900">
                <h1 className="text-2xl font-bold">Note Taker</h1>

                <DarkModeToggle />
            </header>
            <main className="flex-1 overflow-auto p-4">
                <div className="mb-4 ">
                    {/* Input for note title */}
                    <input
                        type="text"
                        placeholder="Title"
                        value={newNote.title || ""}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        className="w-full rounded-md border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {/* Textarea for note content */}
                    <textarea
                        placeholder="Content"
                        value={newNote.content || ""}
                        onChange={(e) =>
                            setNewNote({ ...newNote, content: e.target.value })
                        }
                        className="mt-2 w-full rounded-md border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        rows={4}
                    />
                    {/* Button to add or update note */}
                    {editingNoteId === null ? (
                        <Button onClick={handleAddNote} 
                        className="mt-2">
                            Add Note
                        </Button>
                    ) : (
                        <Button onClick={handleUpdateNote} className="mt-2">
                            Update Note
                        </Button>
                    )}
                </div>
                {/* Display list of notes */}
                <div className="grid gap-4">
                    {sortedNotes.map((note) => (

                        <Card key={note.id} className="p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium">{note.title}</h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditNote(note.id)}
                                    >
                                        <FilePenIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteNote(note.id)}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => togglePinNote(note.id)}>
                                        {note.pinned ? "📌" : "📍"}
                                    </Button>
                                </div>
                            </div>
                            <p className="mt-2 text-muted-foreground">{note.content}</p>
                        </Card>



                    ))}

                </div>
            </main>
        </div>
    );
}