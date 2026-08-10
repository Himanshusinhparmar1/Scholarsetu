import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { NotificationItem } from '../types';
import { Bell, X, Check, Info, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifs();
    }
  }, [isOpen]);

  const markRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 bg-indigo-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-200" />
              <h2 className="text-lg font-bold">Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-indigo-800 text-indigo-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No new notifications.</div>
            ) : (
              notifications.map((n) => {
                let Icon = Info;
                let bg = 'bg-blue-50 text-blue-800 border-blue-200';
                if (n.type === 'success') {
                  Icon = CheckCircle;
                  bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                } else if (n.type === 'warning') {
                  Icon = AlertTriangle;
                  bg = 'bg-amber-50 text-amber-800 border-amber-200';
                } else if (n.type === 'error') {
                  Icon = ShieldAlert;
                  bg = 'bg-rose-50 text-rose-800 border-rose-200';
                }

                return (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      n.read ? 'bg-slate-50 opacity-75 border-slate-200' : `${bg} shadow-xs`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2">
                            {new Date(n.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => markRead(n.id)}
                          title="Mark read"
                          className="p-1 text-slate-400 hover:text-indigo-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
