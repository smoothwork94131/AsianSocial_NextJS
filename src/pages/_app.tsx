import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react';
import Layout from '@/components/Layouts/Index';
import { MantineProvider, ColorSchemeProvider, MantineThemeOverride } from '@mantine/core';
import { useCreateReducer } from '@/hooks/useCreateReducer';
import { initialState, HomeInitialState } from '@/state/index.state';
import { Notifications } from '@mantine/notifications';

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true);
  }, [])

  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });
  const {
    state: {
      colorScheme,
    },
  } = contextValue;

  const myTheme: MantineThemeOverride = {
    colorScheme: colorScheme,
    spacing: {
      chatInputPadding: '40px'
    }
  };
  
  return (
    isClient &&
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={() => { }}>
      <MantineProvider theme={myTheme} withGlobalStyles withNormalizeCSS>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Notifications />
      </MantineProvider>
    </ColorSchemeProvider>

  )
}
