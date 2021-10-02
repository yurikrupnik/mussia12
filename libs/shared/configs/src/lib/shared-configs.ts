export function sharedConfigs(): string {
  return 'shared-configs';
}

export const mongoConfig = () => ({
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/mussia12',
});
