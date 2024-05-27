import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Client',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    iosScheme: 'http',
  }
};

export default config;
