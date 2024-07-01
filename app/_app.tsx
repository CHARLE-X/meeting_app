// _app.tsx
import { AppProps } from 'next/app';
import { UserProvider } from '@/app/context/UserContext';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <UserProvider>
    <Component {...pageProps} />
  </UserProvider>
);

export default MyApp;
