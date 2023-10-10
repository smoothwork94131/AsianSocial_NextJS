import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from 'react';
import { MantineProvider, ColorSchemeProvider, MantineThemeOverride, Container } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import { initialState, HomeInitialState } from '@/state/index.state';
import { useCreateReducer } from '@/hooks/useCreateReducer';
import { supabaseClient } from "@/utils/app/supabase-client";

import Layout from '@/components/Layouts/Index';
import HomeContext from '@/state/index.context';

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
    },
    components: {
      Container: {
        defaultProps: {
          sizes: {
            xs: 540,
            sm: 960,
            md: 1020,
            lg: 1640,
            xl: 1920,
          },
        },
      },
    },
  };

  return (
    isClient &&
    <HomeContext.Provider
      value={{
        ...contextValue,
      }}>
      <SessionContextProvider supabaseClient={supabaseClient}>
        <SessionProvider session={pageProps.session}>
          <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={() => { }}>
            <MantineProvider theme={myTheme} withGlobalStyles withNormalizeCSS>
              <Container size="xl">
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </Container>
              <Notifications />
            </MantineProvider>
          </ColorSchemeProvider>
        </SessionProvider>
      </SessionContextProvider>
    </HomeContext.Provider>
  )
}
