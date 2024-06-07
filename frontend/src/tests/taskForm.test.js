import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TaskForm from '../components/TaskForm';

test('renders TaskForm and submits data', () => {
  render(<TaskForm fetchTasks={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Task' } });
  fireEvent.click(screen.getByText('Add Task'));
  expect(screen.getByPlaceholderText('Title').value).toBe('');
});