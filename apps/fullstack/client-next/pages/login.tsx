import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Formik } from 'formik';
// import axios from 'axios';
// import useSwr from "swr";
// import { useToggle } from "react-use";
// import { signOut, signin } from "next-auth/client";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
// import TextField from "@/components/FormField"; // todo fix eslint
// import useSWR from "swr";
// import { useUser } from "@auth0/nextjs-auth0";
// import { NextPageContext } from "next";
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { uiConfig, auth } from '../firebase';
// import auth from "firebase/auth";
// import { useAuthUser } from "next-firebase-auth";
// import TextField from "../../components/FormField";

import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
} from 'react-social-login-buttons';

import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';

const Login = () => {
  const { logout } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log('errors', errors);
  // console.log('authss', authss);
  // const a = useAuthState(auth);
  // console.log(a);
  // console.log("d", d?.getIdToken()); // eslint-disable-line
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
      return auth.currentUser?.getIdToken();
    }
    return '';
  }, [user]);

  console.log('token', token);

  const router = useRouter();

  const handleSignOut = useCallback(logout, []);

  console.log('errors.email', errors.email);
  return (
    <Grid
      container
      item
      xs={12}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      {/*<Grid xs={12} item>*/}
      {/*  <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />*/}
      {/*</Grid>*/}
      <div>user: {auth.currentUser?.email}</div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Grid
        container
        item
        sm={10}
        xs={12}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <Grid item>
            <TextField
              label={'Email'}
              // required
              error={!!errors.email}
              // required={true}
              // required={}
              // defaultValue="test"
              {...register('email', {
                required: true,
              })}
            />
          </Grid>
          {/* include validation with required or other standard HTML validation rules */}
          <TextField
            label={'Password'}
            error={!!errors.password}
            {...register('password', { required: true })}
          />
          {/* errors will return when field validation fails  */}
          {errors.email && <span>This field is required</span>}
          {errors.password && <span>This field is required</span>}

          <input type="submit" />
        </form>
        {/*<Formik*/}
        {/*  initialValues={{*/}
        {/*    email: '',*/}
        {/*    password: '',*/}
        {/*    rememberMe: false,*/}
        {/*  }}*/}
        {/*  onSubmit={handleSubmit}*/}
        {/*>*/}
        {/*  {(formikProps) => {*/}
        {/*    const { isValid } = formikProps;*/}
        {/*    return (*/}
        {/*      <Grid*/}
        {/*        container*/}
        {/*        item*/}
        {/*        lg={4}*/}
        {/*        md={6}*/}
        {/*        sm={8}*/}
        {/*        xs={12}*/}
        {/*        direction="row"*/}
        {/*        justifyContent="center"*/}
        {/*        alignItems="center"*/}
        {/*      >*/}
        {/*        <Form>*/}
        {/*          <Grid*/}
        {/*            container*/}
        {/*            item*/}
        {/*            xs={12}*/}
        {/*            direction="row"*/}
        {/*            justifyContent="center"*/}
        {/*            alignItems="center"*/}
        {/*          >*/}
        {/*            <Grid item xs={12}>*/}
        {/*              <Typography*/}
        {/*                variant="h6"*/}
        {/*                onClick={handleSignOut}*/}
        {/*                align="center"*/}
        {/*              >*/}
        {/*                SignOut*/}
        {/*              </Typography>*/}
        {/*            </Grid>*/}
        {/*            <Grid item xs={12}>*/}
        {/*              <GoogleLoginButton />*/}
        {/*            </Grid>*/}
        {/*            <GithubLoginButton />*/}
        {/*            <Grid item xs={12}>*/}
        {/*              <Typography variant="body2" align="center">*/}
        {/*                Build The Commercial Travel Website of Your Dreams*/}
        {/*              </Typography>*/}
        {/*            </Grid>*/}
        {/*            <Grid item xs={12}>*/}
        {/*              {loginError && (*/}
        {/*                <Typography variant="body2" align="center">*/}
        {/*                  {loginError}*/}
        {/*                </Typography>*/}
        {/*              )}*/}
        {/*            </Grid>*/}
        {/*            <Grid item xs={12}>*/}
        {/*              <Button*/}
        {/*                fullWidth*/}
        {/*                size="large"*/}
        {/*                color="secondary"*/}
        {/*                variant="contained"*/}
        {/*                onClick={register}*/}
        {/*                data-testid="login_register"*/}
        {/*              >*/}
        {/*                Register*/}
        {/*              </Button>*/}
        {/*            </Grid>*/}
        {/*            <Grid item xs={12}>*/}
        {/*              <Grid*/}
        {/*                container*/}
        {/*                direction="row"*/}
        {/*                justifyContent="center"*/}
        {/*                alignItems="center"*/}
        {/*              >*/}
        {/*                <Grid item xs={5}>*/}
        {/*                  <Divider*/}
        {/*                    orientation="horizontal"*/}
        {/*                    variant="fullWidth"*/}
        {/*                  />*/}
        {/*                </Grid>*/}
        {/*                <Grid item xs={2}>*/}
        {/*                  <Typography variant="body1" align="center">*/}
        {/*                    OR*/}
        {/*                  </Typography>*/}
        {/*                </Grid>*/}
        {/*                <Grid item xs={5}>*/}
        {/*                  <Divider*/}
        {/*                    orientation="horizontal"*/}
        {/*                    variant="fullWidth"*/}
        {/*                  />*/}
        {/*                </Grid>*/}
        {/*              </Grid>*/}
        {/*            </Grid>*/}
        {/*            <Grid item xs={12}>*/}
        {/*              <TextField*/}
        {/*                fullWidth*/}
        {/*                type="text"*/}
        {/*                name="email"*/}
        {/*                label="Email"*/}
        {/*                disabled={loading}*/}
        {/*              />*/}
        {/*            </Grid>*/}
        {/*            <Grid item xs={12}>*/}
        {/*              <TextField*/}
        {/*                fullWidth*/}
        {/*                type="password"*/}
        {/*                name="password"*/}
        {/*                label="Password"*/}
        {/*                disabled={loading}*/}
        {/*              />*/}
        {/*            </Grid>*/}
        {/*            <Grid item container xs={12} alignItems="center">*/}
        {/*              <Grid*/}
        {/*                item*/}
        {/*                sm={6}*/}
        {/*                xs={12}*/}
        {/*                container*/}
        {/*                justifyContent="flex-end"*/}
        {/*              >*/}
        {/*                <Button disabled={loading}>Forgot Password</Button>*/}
        {/*              </Grid>*/}
        {/*            </Grid>*/}
        {/*            <Grid item xs={12}>*/}
        {/*              <Button*/}
        {/*                fullWidth*/}
        {/*                size="large"*/}
        {/*                variant="contained"*/}
        {/*                type="submit"*/}
        {/*                disabled={!isValid}*/}
        {/*              >*/}
        {/*                Login*/}
        {/*              </Button>*/}
        {/*            </Grid>*/}
        {/*          </Grid>*/}
        {/*        </Form>*/}
        {/*      </Grid>*/}
        {/*    );*/}
        {/*  }}*/}
        {/*</Formik>*/}
      </Grid>
    </Grid>
  );
};

// const Login = () => {
//   return <div>heelo from login</div>
// }
// todo does not work with next export
// export async function getServerSideProps() {
//     console.log("process.env.VERCEL_URL", process.env.VERCEL_URL); // eslint-disable-line
//
//     return {
//         props: {}
//     };
// }

export default Login;
