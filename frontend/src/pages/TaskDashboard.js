import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../App.css";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editingTask, setEditingTask] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [searchName, setSearchName] = useState('');
  const [searchPriority, setSearchPriority] = useState('');
    const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error.response ? error.response.data.message : error.message);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/tasks', { title, description, priority }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, response.data]);
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (error) {
      console.error('Error adding task:', error.response ? error.response.data.message : error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Deleting task with ID: ${id}`);
      const response = await axios.delete(`/api/tasks/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Delete response:', response.data);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error.response ? error.response.data.message : error.message);
    }
  };


  const editTask = (task) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description);
    setNewPriority(task.priority);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/tasks/${editingTask._id}`, {
        title: newTitle,
        description: newDescription,
        priority: newPriority,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error.response ? error.response.data.message : error.message);
    }
  };

    const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchTasks();
  }, []);
    
 const filteredTasks = tasks.filter(task => {
    return (
      task.title.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchPriority === '' || task.priority === searchPriority)
    );
  });

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>FlashLink Dashboard</h1>
        <div className="header-buttons">
          <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par titre"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <select
          value={searchPriority}
          onChange={(e) => setSearchPriority(e.target.value)}
        >
          <option value="">Priorité</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <form onSubmit={addTask} className="add-task-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit"> + Tâche </button>
      </form>
      <div className="task-container">
        {filteredTasks.map(task => (
          <div key={task._id} className={`task-card ${task.priority}`}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <button onClick={() => editTask(task)} className="edit-button">Modifier</button>
            <span className="priority-indicator"></span>
          </div>
        ))}
      </div>
      {editingTask && (
        <form onSubmit={updateTask} className="edit-form">
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit"> Validez Modification </button>
        </form>
      )}
    </div>
  );
};

export default TaskDashboard;
