import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const editInputRef = useRef(null);

  // Load todos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Auto-focus edit input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (trimmed) {
      setTodos([{ id: Date.now(), text: trimmed, completed: false }, ...todos]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: trimmed } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodo();
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>📝 My Todo List</h1>
        <p>{todos.length} {todos.length === 1 ? 'task' : 'tasks'} remaining</p>
      </div>
      
      <div className="input-section">
        <div className="input-container">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done today?"
            onKeyDown={handleKeyDown}
            className="task-input"
            maxLength={100}
          />
          <button onClick={addTodo} className="add-btn" disabled={!input.trim()}>
            Add Task
          </button>
        </div>
      </div>

      <ul className="todo-list" role="list">
        {todos.length === 0 ? (
          <li className="empty-state" role="alert">
            <div className="empty-icon">✨</div>
            <p>No tasks yet. Add your first task above!</p>
          </li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''} ${editingId === todo.id ? 'editing' : ''}`} role="listitem">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
                id={`todo-${todo.id}`}
              />
              
              <label htmlFor={`todo-${todo.id}`} className="todo-text" onClick={() => toggleTodo(todo.id)}>
                {todo.text}
              </label>
              
              {editingId === todo.id ? (
                <div className="edit-container">
                  <input
                    ref={editInputRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    onBlur={saveEdit}
                    className="edit-input"
                    maxLength={100}
                  />
                </div>
              ) : (
                <div className="todo-actions">
                  <button 
                    onClick={() => startEdit(todo.id, todo.text)}
                    className="btn btn-edit"
                    aria-label="Edit task"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="btn btn-delete"
                    aria-label="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
