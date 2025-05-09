import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Calendar, 
  Clock, 
  X, 
  Check, 
  ChevronRight,
  Megaphone,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'announcement' | 'alert';
  date: string;
  isRead: boolean;
  actionUrl?: string;
  eventId?: number;
}

interface NotificationsHubProps {
  userId: number;
}

export default function NotificationsHub({ userId }: NotificationsHubProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Mock notifications - in a real app, this would come from an API
  useEffect(() => {
    // Simulate fetching notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Registration Deadline Approaching',
        message: 'Healthcare Tech Solutions Hackathon registration closes in 2 days. Complete your registration now!',
        type: 'deadline',
        date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        eventId: 2
      },
      {
        id: '2',
        title: 'Project Submission Reminder',
        message: 'The deadline for FinTech Innovation Challenge submissions is in 24 hours. Finalize your project!',
        type: 'deadline',
        date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        eventId: 4
      },
      {
        id: '3',
        title: 'New Hackathon Announced',
        message: 'Global AI Innovation Hackathon has been announced with $10,000 in prizes!',
        type: 'announcement',
        date: new Date().toISOString(),
        isRead: true,
        eventId: 1
      },
      {
        id: '4',
        title: 'Team Invitation',
        message: 'You have been invited to join team "DataMinds" for the Healthcare Tech Solutions Hackathon.',
        type: 'alert',
        date: new Date(new Date().getTime() - 12 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        actionUrl: '/team-invitations'
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, []);
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
    
    toast({
      title: 'All notifications marked as read',
      description: 'You have no unread notifications remaining.',
    });
  };
  
  // Set up deadline reminders
  const setupReminder = (eventId: number) => {
    toast({
      title: 'Reminder Set',
      description: 'You will be notified 24 hours before the deadline.',
    });
    setIsOpen(false);
  };
  
  // Format date relative to current time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 0) {
      const absHours = Math.abs(diffInHours);
      if (absHours < 24) {
        return `${absHours} hour${absHours !== 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(absHours / 24);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
      }
    } else if (diffInHours < 24) {
      return `In ${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `In ${days} day${days !== 1 ? 's' : ''}`;
    }
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'announcement':
        return <Megaphone className="h-5 w-5 text-green-500" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };
  
  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
      
      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-lg shadow-lg border z-50"
          >
            <div className="p-3 border-b flex items-center justify-between">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-800 ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm mb-1 truncate pr-2">
                            {notification.title}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatRelativeTime(notification.date)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        {notification.type === 'deadline' && (
                          <div className="flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setupReminder(notification.eventId || 0);
                              }}
                              className="h-8 text-xs"
                            >
                              <Bell className="h-3 w-3 mr-1" />
                              Set Reminder
                            </Button>
                          </div>
                        )}
                        
                        {notification.actionUrl && (
                          <div className="flex justify-end">
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="h-7 text-xs p-0"
                            >
                              View Details
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-2 border-t text-center">
              <Button variant="link" size="sm" className="text-xs">
                View All Notifications
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}