import React, { useState } from 'react';
import { Task } from '../types';
import { validateTaskName, validateDuration } from '../utils/validators';
import { TaskService } from '../services/taskService';
import './TaskForm.css';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
  existingTasks: Task[];
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, existingTasks }) => {
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('1');
  const [durationUnit, setDurationUnit] = useState<'دقيقة' | 'ساعة' | 'يوم'>('دقيقة');
  const [pattern, setPattern] = useState<'يومي' | 'أسبوعي' | 'مخصص'>('مخصص');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTaskName(value);

    // Show suggestions
    if (value.length > 0) {
      const matching = existingTasks
        .map(t => t.name)
        .filter(name => name.includes(value) && name !== value);
      setSuggestions([...new Set(matching)].slice(0, 3));
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate
    const nameValidation = validateTaskName(taskName);
    if (!nameValidation.valid) {
      newErrors.taskName = nameValidation.error || '';
    }

    const durationValidation = validateDuration(parseInt(duration));
    if (!durationValidation.valid) {
      newErrors.duration = durationValidation.error || '';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create task
    const newTask: Omit<Task, 'id'> = {
      name: taskName,
      duration: parseInt(duration),
      durationUnit,
      pattern,
      isActive: true,
      createdAt: new Date(),
      nextTrigger: TaskService.calculateNextTriggerTime(
        parseInt(duration),
        durationUnit,
        pattern
      ),
      notificationSent: false,
      color: getRandomColor(),
    };

    onAddTask(newTask);

    // Reset form
    setTaskName('');
    setDuration('1');
    setDurationUnit('دقيقة');
    setPattern('مخصص');
    setErrors({});
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTaskName(suggestion);
    setSuggestions([]);
  };

  const getRandomColor = () => {
    const colors = ['#ff6b35', '#004e89', '#1abc9c', '#f39c12', '#9b59b6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="task-form-container">
      <form className="task-form" onSubmit={handleSubmit}>
        <h2>➕ أضف مهمة جديدة</h2>

        <div className="form-group">
          <label htmlFor="taskName">اسم المهمة</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={handleNameChange}
              placeholder="مثلاً: جمع الموارد، تطوير المدينة..."
              className={errors.taskName ? 'error' : ''}
            />
            {suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.taskName && <span className="error-message">{errors.taskName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="duration">المدة</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              max="10000"
              className={errors.duration ? 'error' : ''}
            />
            {errors.duration && <span className="error-message">{errors.duration}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="durationUnit">الوحدة</label>
            <select
              id="durationUnit"
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as any)}
            >
              <option value="دقيقة">دقيقة</option>
              <option value="ساعة">ساعة</option>
              <option value="يوم">يوم</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pattern">النمط</label>
            <select
              id="pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value as any)}
            >
              <option value="مخصص">مخصص</option>
              <option value="يومي">يومي</option>
              <option value="أسبوعي">أسبوعي</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          ✅ أضف المهمة
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
