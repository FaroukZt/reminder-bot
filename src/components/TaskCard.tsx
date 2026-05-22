import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { getTimeUntil, formatDateTime } from '../utils/timeUtils';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onUpdate,
  onDelete,
  onToggle,
}) => {
  const [timeUntil, setTimeUntil] = useState(getTimeUntil(task.nextTrigger));
  const [editingTime, setEditingTime] = useState(false);
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntil(getTimeUntil(task.nextTrigger));
    }, 1000);

    return () => clearInterval(interval);
  }, [task.nextTrigger]);

  const handleTimeEdit = () => {
    const hours = String(task.nextTrigger.getHours()).padStart(2, '0');
    const minutes = String(task.nextTrigger.getMinutes()).padStart(2, '0');
    setNewTime(`${hours}:${minutes}`);
    setEditingTime(true);
  };

  const handleTimeSave = () => {
    if (!newTime) return;
    const [hours, minutes] = newTime.split(':').map(Number);
    const updated = new Date(task.nextTrigger);
    updated.setHours(hours, minutes);
    onUpdate(task.id, { nextTrigger: updated });
    setEditingTime(false);
  };

  const handleSnooze = (minutes: number) => {
    const updated = new Date();
    updated.setMinutes(updated.getMinutes() + minutes);
    onUpdate(task.id, {
      nextTrigger: updated,
      notificationSent: false,
    });
  };

  const isOverdue = task.nextTrigger < new Date() && task.isActive;

  return (
    <div
      className={`task-card ${!task.isActive ? 'inactive' : ''} ${isOverdue ? 'overdue' : ''}`}
      style={{ borderColor: task.color }}
    >
      <div className="card-header">
        <h3>{task.name}</h3>
        <button
          className={`toggle-btn ${task.isActive ? 'active' : ''}`}
          onClick={() => onToggle(task.id)}
          title={task.isActive ? 'إيقاف' : 'تفعيل'}
        >
          {task.isActive ? '⏸' : '▶'}
        </button>
      </div>

      <div className="card-body">
        <div className="time-info">
          <div className="countdown">
            <span className="label">الوقت المتبقي:</span>
            <span className={`value ${isOverdue ? 'overdue-text' : ''}`}>{timeUntil}</span>
          </div>
          <div className="next-trigger">
            <span className="label">التنبيه في:</span>
            {editingTime ? (
              <div className="time-editor">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
                <button onClick={handleTimeSave} className="save-btn">✓</button>
                <button
                  onClick={() => setEditingTime(false)}
                  className="cancel-btn"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <span className="value">{formatDateTime(task.nextTrigger)}</span>
                <button
                  className="edit-time-btn"
                  onClick={handleTimeEdit}
                  title="تعديل الوقت"
                >
                  ✏️
                </button>
              </>
            )}
          </div>
        </div>

        <div className="task-meta">
          <span className="badge">{task.pattern}</span>
          <span className="badge duration">
            {task.duration} {task.durationUnit}
          </span>
        </div>
      </div>

      <div className="card-footer">
        <div className="snooze-buttons">
          <button
            className="snooze-btn"
            onClick={() => handleSnooze(5)}
            title="تأجيل 5 دقائق"
          >
            +5د
          </button>
          <button
            className="snooze-btn"
            onClick={() => handleSnooze(15)}
            title="تأجيل 15 دقيقة"
          >
            +15د
          </button>
          <button
            className="snooze-btn"
            onClick={() => handleSnooze(60)}
            title="تأجيل ساعة"
          >
            +1س
          </button>
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(task.id)}
          title="حذف المهمة"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
