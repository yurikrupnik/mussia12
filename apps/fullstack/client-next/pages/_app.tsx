import { AppProps } from 'next/app';
import React from 'react';
// import { Provider } from "next-auth/client";
import Head from 'next/head';
import CssBaseline from '@material-ui/core/CssBaseline';
// import { UserProvider } from "@auth0/nextjs-auth0";
// import * as Sentry from "@sentry/react";
// import { Integrations } from "@sentry/tracing";
import type {} from '@mussia12/shared/mongoose-schemas';
import ThemeProvider from '@mussia12/fullstack/mui-theme-provider';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import axios from "axios";
// import '../styles/globals.css';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import { drawerWidthClose, drawerWidthOpen } from "../utils/consts";
// import ThemeProvider from '../providers/ThemeProvider';

// Sentry.init({
//     dsn:
//         "https://1e5c714cd2a445b7a6fb0c25f2e8daf2@o599478.ingest.sentry.io/5743575",
//     integrations: [new Integrations.BrowserTracing()],
//
//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0
// });

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

// function getBilling() {
//     // return axios.get("https://aris-8jo9nv6l.ew.gateway.dev/hello");
//     return axios.get("/gateway/billing");
//     // .then((resp) => {
//     //     res.statusCode = 200;
//     //     res.json(resp);
//     // })
//     // .catch((err) => {
//     //     res.statusCode = 500;
//     //     res.json(err.message);
//     // });
// }

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const classes = createClasses();

  // const { user } = pageProps;
  // console.log("user in myApp", user); // eslint-disable-line
  //
  // useEffect(() => {
  //     console.log("useruser", user); // eslint-disable-line
  //     // getBilling()
  //     //     .then((r) => {
  //     //         console.log("r", r.data);
  //     //     })
  //     //     .catch((err) => {
  //     //         console.log("err", err.message);
  //     //     });
  // }, []);
  return (
    <>
      <Head>
        <title>My pages</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* breaking build todo */}
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
    </>
  );
};

export default MyApp;
