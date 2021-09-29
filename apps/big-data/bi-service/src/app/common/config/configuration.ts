export default () => ({
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/mussia12',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
