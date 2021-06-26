import toast, { Toaster } from 'react-hot-toast';

function ToastNotify(error: boolean, message: string) {
  
  if (error) {
    return toast.error(message, {
      duration: 3000,
      position: 'top-left'
    });
  } else {
    return toast.success(message, {
      duration: 3000,
      position: 'top-left'
    });
  }
}

export { ToastNotify, Toaster }