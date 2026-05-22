import React, { useState } from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'trigger'>('trigger');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return task.isActive;
    if (filter === 'completed') return !task.isActive;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'trigger') {
      return a.nextTrigger.getTime() - b.nextTrigger.getTime();
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const activeTasks = tasks.filter(t => t.isActive).length;
  const totalTasks = tasks.length;

  return (
    <div className="task-list-container">
      <div className="list-header">
        <h2>📋 المهام ({activeTasks}/{totalTasks})</h2>
        <div className="controls">
          <div className="filter-group">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              الكل
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              نشطة
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              موقوفة
            </button>
          </div>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="trigger">ترتيب حسب الوقت</option>
            <option value="created">ترتيب حسب الإنشاء</option>
          </select>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="empty-state">
          <p>📭 لا توجد مهام حالياً</p>
          <p className="subtitle">أضف مهمة جديدة للبدء</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onToggle={onToggleTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
