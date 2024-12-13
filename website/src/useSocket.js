// useSocket.js
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const useSocket = (onReload) => {
  useEffect(() => {
    const socket = io('http://127.0.0.1:5555'); // URL del servidor

    socket.on('reload_page', () => {
      onReload();
    });

    return () => {
      socket.disconnect();
    };
  }, [onReload]);
};

export default useSocket;