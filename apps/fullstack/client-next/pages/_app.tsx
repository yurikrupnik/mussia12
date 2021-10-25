import { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
// import CssBaseline from '@material-ui/core/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
// import ThemeProvider from '@mussia12/fullstack/mui-theme-provider';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCache from '@emotion/cache';
import theme from '@mussia12/shared/fe-mui-theme1';

function createEmotionCache() {
  return createCache({ key: 'css' });
}

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp: React.FC<AppProps> = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My pages</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* breaking build todo */}
      <ThemeProvider theme={theme}>
       <>
         <CssBaseline />
         <Component {...pageProps} />
       </>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
