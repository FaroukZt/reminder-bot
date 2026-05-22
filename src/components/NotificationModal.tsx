import React from 'react';
import { NotificationData } from '../types';
import './NotificationModal.css';

interface NotificationModalProps {
  notification: NotificationData;
  onClose: () => void;
  onSnooze: (minutes: number) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notification,
  onClose,
  onSnooze,
}) => {
  return (
    <div className="modal-overlay">
      <div className="notification-modal">
        <div className="modal-header">
          <h2>⏰ تنبيه</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="notification-icon">🔔</div>
          <h3>{notification.taskName}</h3>
          <p>حان الوقت للقيام بهذه المهمة!</p>
          <p className="time-text">
            {notification.time.toLocaleTimeString('ar-EG')}
          </p>
        </div>

        <div className="modal-actions">
          <button className="action-btn primary" onClick={onClose}>
            تم ✓
          </button>
          <button className="action-btn" onClick={() => onSnooze(5)}>
            تأجيل 5 د
          </button>
          <button className="action-btn" onClick={() => onSnooze(15)}>
            تأجيل 15 د
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
