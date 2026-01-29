import React, { useState, useEffect } from "react";
import StickyNoteButton from "./StickyNoteButton";
import StickyNoteEditor from "./StickyNoteEditor";
import StickyNote from "./StickyNote";

const StickyNotesContainer = () => {
  const [notes, setNotes] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('stickyNotes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
  }, [notes]);

  const handleSaveNote = (noteData) => {
    if (editingNote) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === editingNote.id ? noteData : note
      ));
    } else {
      // Add new note
      setNotes([...notes, noteData]);
    }
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Delete this sticky note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  return (
    <>
      {/* Render all sticky notes */}
      {notes.map(note => (
        <StickyNote
          key={note.id}
          note={note}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteNote}
          onEdit={handleEditNote}
        />
      ))}

      {/* Add new sticky note button */}
      <StickyNoteButton onClick={() => setShowEditor(true)} />

      {/* Sticky note editor popup */}
      {showEditor && (
        <StickyNoteEditor
          initialNote={editingNote}
          onSave={handleSaveNote}
          onClose={() => {
            setShowEditor(false);
            setEditingNote(null);
          }}
        />
      )}
    </>
  );
};

export default StickyNotesContainer;