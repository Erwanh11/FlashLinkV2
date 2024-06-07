const nodemailer = require('nodemailer');
const Task = require('../models/Task');
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
exports.createTask = async (req, res) => {
  const { title, description, priority } = req.body;
  try {
    const task = new Task({ user: req.user.id, title, description, priority });
    await task.save();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: 'New Task Created',
      text: `Task ${title} has been created with priority ${priority}.`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status } = req.body;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    console.log(`Request to delete task with id: ${req.params.id}`);
    
    // Trouver la tâche
    const task = await Task.findById(req.params.id);
    if (!task) {
      console.log('Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    // Vérifier si l'utilisateur est autorisé
    if (task.user.toString() !== req.user.id) {
      console.log('Not authorized to delete this task');
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Supprimer la tâche
    await task.remove();
    console.log('Task removed successfully');
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};