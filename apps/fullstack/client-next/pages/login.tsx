import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Formik } from 'formik';
import axios from 'axios';
// import { useToggle } from "react-use";
// import { signOut, signin } from "next-auth/client";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Hidden from '@material-ui/core/Hidden';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { useCollection } from 'react-firebase-hooks/firestore';
// import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import MailOutlineIcon from "@material-ui/icons/MailOutline";
// import VpnKeyIcon from "@material-ui/icons/VpnKey";
// import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
// import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
// import Checkbox from "@material-ui/core/Checkbox";

// import { useHistory } from "react-router";
// import RenderInput from "../../components/uiComponents/RenderInput";
// import DialogPasswordInfo from "../../components/uiComponents/DialogPasswordInfo";
import { useRouter } from 'next/router';
// import TextField from "@/components/FormField"; // todo fix eslint
// import useSWR from "swr";
// import { useUser } from "@auth0/nextjs-auth0";
// import { NextPageContext } from "next";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
// import { uiConfig } from '../utils/firebase';
// import firebase from 'firebase';
// import auth from "firebase/auth";
// import { useAuthUser } from "next-firebase-auth";
// import TextField from '../../components/FormField';

const logo = '';
const logoBlack = '';
const Login = () => {
  // const [d] = useAuthState(firebase.auth());
  // console.log('d', d?.getIdToken()); // eslint-disable-line
  // const [session] = [{}];
  // const [session] = useSession();
  // console.log("session", session); // eslint-disable-line
  // console.log("loading", loading);
  // const [u, loading, error] = useAuthUser(firebase.auth());

  const [user, setUser] = useState({}); // Local signed-in state.
  // const [localToken, setToken] = useState(""); // Local signed-in state.
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const token = useMemo(() => {
    if (user) {
      // return firebase.auth().currentUser?.getIdToken();
    }
    return '';
  }, [user]);

  // const [pets] = useCollection(firebase.firestore().collection('pets'));
  // const readyPets = useMemo(() => {
  //   if (!pets) {
  //     return [];
  //   }
  //   return pets?.docs.map((f) => ({
  //     ...f.data(),
  //     id: f.id,
  //   }));
  // }, [pets]);
  // console.log("votesError", votesError);
  // console.log("votesLoading", votesLoading);
  // console.log("readyPets", readyPets);
  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    // const unregisterAuthObserver = firebase
    //   .auth()
    //   .onAuthStateChanged(async (userr) => {
    //     if (userr) {
    //       setUser(userr);
    //     }
    //     setIsSignedIn(!!userr);
    //   });
    // return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  // useEffect(() => {
  //     const unregisterAuthObserver = firebase.auth().onIdTokenChanged((a) => {
  //         console.log("onIdTokenChanged", a);
  //     });
  //     return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  // }, [user]);

  useEffect(() => {
    if (isSignedIn && token) {
      axios.get('/api/users').then((res) => {
        console.log('users', res);
      });
      // console.log("user", user);
      // console.log("token", token);
      // console.log("localToken", localToken);
      // firebase
      //     .firestore()
      //     .collection("pets")
      //     .get()
      //     .then((res) => {
      //         // console.log(
      //         //     "rees.docs",
      //         //     rees.docs.map((a) => {
      //         //         console.log("id", a.id);
      //         //         console.log("data", a.data());
      //         //     })
      //         // );
      //
      //         console.log("res.docs", res.docs);
      //         // res.docs[0].id
      //         axios
      //             .get("/api/service1", {
      //                 params: {
      //                     id: res.docs[0].id
      //                 },
      //                 headers: {
      //                     // eslint-disable-next-line
      //                     // @ts-ignore
      //                     Authorization: `Bearer ${token.i}`
      //                 }
      //             })
      //             .then((service1) => {
      //                 console.log({ service1 });
      //             })
      //             .catch((err) => {
      //                 console.log({ err });
      //             });
      //         // rees.docs.map
      //         // rees.map((ds) => {
      //         //     console.log("ds", ds.data());
      //         // });
      //     });
      // axios
      //   .get('/gateway/service1', {
      //     headers: {
      //       // eslint-disable-next-line
      //       // @ts-ignore
      //       Authorization: `Bearer ${token.i}`,
      //     },
      //   })
      //   .then((service1) => {
      //     console.log({ service1 });
      //   })
      //   .catch((err) => {
      //     console.log({ err });
      //   });
      // axios
      //   .get('/gateway/service2', {
      //     headers: {
      //       // eslint-disable-next-line
      //       // @ts-ignore
      //       Authorization: `Bearer ${token.i}`,
      //     },
      //   })
      //   .then((service2) => {
      //     console.log({ service2 });
      //   })
      //   .catch((err) => {
      //     console.log({ err });
      //   });
    }
  }, [isSignedIn, token]);

  // const user = useUser();
  // console.log("user state", user); // eslint-disable-line
  // console.log("isSignedIn", isSignedIn); // eslint-disable-line
  // const { data, mutate } = useSWR("/api/users", fetcher);
  // console.log("{ data, mutate }", { data, mutate }); // eslint-disable-line
  // const classes = loginStyles();
  // const [shouldRender, setShouldRender] = useState(false);
  const router = useRouter();

  // const [open, toggleOpen] = useToggle(false);
  // const [openInfo, toggleOpenInfo] = useToggle(false);
  // const languages = useContext(LanguagesTypes);
  // const currencies = useContext(Currencies);
  // const onboarding = useContext(Onboarding);
  // const auth = useContext(Auth);
  const [loginError] = useState('');
  const [loading] = useState(false);

  const register = useCallback(() => {
    router.push('/onboarding/25');
  }, [router]);

  const handleSignOut = useCallback(() => {
    // signOut();
    // firebase.auth().signOut();
  }, []);

  const handleSubmit = useCallback(
    (values) =>
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      }).then(() => {
        router.push('/dashboard');
      }),
    []
  );

  const [url, setUrl] = useState('');

  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      // const [metadata] = await firebase
      //     .storage()
      //     .bucket("mussia8.appspot.com")
      //     .getMetadata();

      // console.log("metadata", metadata);
      // const ref = firebase.storage().ref(file.name);
      // // ref.getMetadata().then((meta) => {
      // //     console.log("meta", meta);
      // // });
      // ref.put(file).then(() => {
      //   ref
      //     .getDownloadURL()
      //     .then((r) => {
      //       setUrl(r);
      //       console.log('r', r);
      //     })
      //     .catch((err) => {
      //       console.log('err', err);
      //     });
      // });
    },
    [token]
  );

  return (
    <Grid
      container
      item
      xs={12}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid>
        <img src={url} alt="" />
      </Grid>
      <Grid item xs={12}>
        <Hidden smDown>
          <img src={logo} alt="logo" />
        </Hidden>
        <Hidden mdUp>
          <img src={logoBlack} alt="logos" />
        </Hidden>
      </Grid>
      <h1>My App</h1>
      <p>Please sign-in </p>
      {/*{readyPets.map((pet) => (*/}
      {/*  <Grid container key={pet.id}>*/}
      {/*    <Grid item xs={3}>*/}
      {/*      {pet.id}*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*))}*/}
      <Grid xs={12} item>
        {/*<StyledFirebaseAuth*/}
        {/*  uiConfig={uiConfig}*/}
        {/*  firebaseAuth={firebase.auth()}*/}
        {/*/>*/}
      </Grid>
      <Grid>
        <input type="file" onChange={handleFileUpload} />
      </Grid>
      <Grid
        container
        item
        sm={10}
        xs={12}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Formik
          initialValues={{
            email: '',
            password: '',
            rememberMe: false,
          }}
          onSubmit={handleSubmit}
        >
          {(formikProps) => {
            const { isValid } = formikProps;
            return (
              <Grid
                container
                item
                lg={4}
                md={6}
                sm={8}
                xs={12}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Form>
                  <Grid
                    container
                    item
                    xs={12}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        onClick={handleSignOut}
                        align="center"
                      >
                        Welcome
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" align="center">
                        Build The Commercial Travel Website of Your Dreams
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      {loginError && (
                        <Typography variant="body2" align="center">
                          {loginError}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        size="large"
                        color="secondary"
                        variant="contained"
                        onClick={register}
                        data-testid="login_register"
                      >
                        Register
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item xs={5}>
                          <Divider
                            orientation="horizontal"
                            variant="fullWidth"
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body1" align="center">
                            OR
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <Divider
                            orientation="horizontal"
                            variant="fullWidth"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    {/*<Grid item xs={12}>*/}
                    {/*  <TextField*/}
                    {/*    fullWidth*/}
                    {/*    type="text"*/}
                    {/*    name="email"*/}
                    {/*    label="Email"*/}
                    {/*    disabled={loading}*/}
                    {/*  />*/}
                    {/*</Grid>*/}
                    {/*<Grid item xs={12}>*/}
                    {/*  <TextField*/}
                    {/*    fullWidth*/}
                    {/*    type="password"*/}
                    {/*    name="password"*/}
                    {/*    label="Password"*/}
                    {/*    disabled={loading}*/}
                    {/*  />*/}
                    {/*</Grid>*/}
                    {/*<Grid item container xs={12} alignItems="center">*/}
                    {/*  <Grid*/}
                    {/*    item*/}
                    {/*    sm={6}*/}
                    {/*    xs={12}*/}
                    {/*    container*/}
                    {/*    justifyContent="flex-end"*/}
                    {/*  >*/}
                    {/*    <Button disabled={loading}>Forgot Password</Button>*/}
                    {/*  </Grid>*/}
                    {/*</Grid>*/}
                    {/*<Grid item xs={12}>*/}
                    {/*  <Button*/}
                    {/*    fullWidth*/}
                    {/*    size="large"*/}
                    {/*    variant="contained"*/}
                    {/*    type="submit"*/}
                    {/*    disabled={!isValid}*/}
                    {/*  >*/}
                    {/*    Login*/}
                    {/*  </Button>*/}
                    {/*</Grid>*/}
                    {/*<Button*/}
                    {/*    onClick={() => signin("google")}*/}
                    {/*>*/}
                    {/*    Google*/}
                    {/*</Button>*/}
                    {/*<Button*/}
                    {/*    onClick={() => signin("github")}*/}
                    {/*>*/}
                    {/*    Github*/}
                    {/*</Button>*/}
                    {/*<Button onClick={() => signin("auth0")}>*/}
                    {/*    Auth0*/}
                    {/*</Button>*/}
                    {/*<Button onClick={() => signOut()}>*/}
                    {/*    Logout*/}
                    {/*</Button>*/}
                    <a href="/api/auth/login">Login</a>;
                    {/*<a href="/api/auth/google">*/}
                    <a href="/api/auth/logout">logout</a>;
                    {/*<a href="/api/auth/google">*/}
                    {/*    <Button>Google</Button>*/}
                    {/*</a>*/}
                    {/*<a href="/api/auth/github">*/}
                    {/*    <Button>Github</Button>*/}
                    {/*</a>*/}
                    {/*<a href="/auth/bitbucket">*/}
                    {/*    <Button>bitbucket</Button>*/}
                    {/*</a>*/}
                  </Grid>
                </Form>
              </Grid>
            );
          }}
        </Formik>
      </Grid>
    </Grid>
  );
};

// todo does not work with next export
// export async function getServerSideProps() {
//     console.log("process.env.VERCEL_URL", process.env.VERCEL_URL); // eslint-disable-line
//
//     return {
//         props: {}
//     };
// }

export default Login;
