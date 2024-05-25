import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Client',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  }
};

export default config;
