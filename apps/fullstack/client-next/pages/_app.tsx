import { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@mussia12/fullstack/mui-theme-provider';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

const createClasses = makeStyles((theme) => ({
  container: {
    minHeight: '100vh',
  },
  contentContainer: {
    paddingTop: theme.spacing(3),
    // paddingLeft: `calc(${drawerWidthOpen} + ${theme.spacing(4)}px)`,
    [theme.breakpoints.down(1440)]: {
      // paddingLeft: `calc(${drawerWidthClose} + ${theme.spacing(4)}px)`
    },
  },
}));

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const classes = createClasses();

  return (
    <>
      <Head>
        <title>My pages</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <>
            <CssBaseline />
            <Grid container className={classes.container}>
              {/*<Sidebar />*/}
              <Grid container direction="column" item xs>
                <Grid item>{/*<Header />*/}</Grid>
                <Grid item xs className={classes.contentContainer}>
                  {/* eslint-disable-next-line */}
                  <Component {...pageProps} />
                </Grid>
              </Grid>
            </Grid>
          </>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
