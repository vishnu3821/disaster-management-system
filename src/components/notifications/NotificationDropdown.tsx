import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellOff, CheckSquare } from 'lucide-react';
import { useNotifications, Notification } from '../../contexts/NotificationContext';
import { formatRelativeTime } from '../../utils/dateUtils';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.relatedTo) {
      if (notification.relatedTo.type === 'disaster') {
        navigate(`/disaster/${notification.relatedTo.id}`);
      } else if (notification.relatedTo.type === 'user') {
        navigate(`/profile`);
      }
    }
    
    onClose();
  };

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
      case 'error':
        return <div className="w-2 h-2 rounded-full bg-red-500"></div>;
      case 'warning':
        return <div className="w-2 h-2 rounded-full bg-yellow-500"></div>;
      case 'info':
      default:
        return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50"
    >
      <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
        >
          <CheckSquare size={14} className="mr-1" />
          Mark all as read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            <BellOff className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  {getIconForType(notification.type)}
                </div>
                <div className="ml-3 w-full">
                  <p className={`text-sm ${!notification.isRead ? 'font-medium' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(new Date(notification.createdAt))}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="px-4 py-2 border-t border-gray-200 text-center">
        <button
          onClick={onClose}
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;