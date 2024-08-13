import React, { useEffect, memo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastNotificationProps {
  config: ToastConfig | null;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ config }) => {
  useEffect(() => {
    if (config) {
      const { message, type } = config;
      switch (type) {
        case 'success':
          toast.success(message);
          break;
        case 'error':
          toast.error(message);
          break;
        case 'info':
          toast.info(message);
          break;
        case 'warning':
          toast.warning(message);
          break;
        default:
          toast(message);
      }
    }
  }, [config]);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default memo(ToastNotification);