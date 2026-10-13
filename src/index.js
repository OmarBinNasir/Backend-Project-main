import 'dotenv/config';
import { app } from './app.js';
import connectDB from './db/index.js';

const port = Number(process.env.PORT || 8000);

try {
  await connectDB();
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`VPlay instance ${process.env.INSTANCE_ID || 'local'} listening on ${port}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received; closing HTTP server`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
} catch (error) {
  console.error('Failed to start VPlay:', error);
  process.exit(1);
}
