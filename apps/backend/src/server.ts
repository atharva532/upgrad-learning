import { app } from './app.js';

const PORT = process.env.API_PORT || 3001;
const HOST = process.env.API_HOST || 'localhost';

const server = app.listen(PORT, () => {
    console.info(`
🚀 Server is running!
📍 URL: http://${HOST}:${PORT}
🔧 Environment: ${process.env.NODE_ENV || 'development'}
📚 Health: http://${HOST}:${PORT}/api/health
  `);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
    console.info(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
        console.info('HTTP server closed.');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
