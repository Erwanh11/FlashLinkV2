import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(data);
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <div>
      <TaskForm fetchTasks={fetchTasks} />
      <TaskList tasks={tasks} updateTask={() => {}} deleteTask={() => {}} />
    </div>
  );
};
export default TaskDashboard;
