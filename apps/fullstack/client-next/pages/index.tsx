import { useEffect, useState } from 'react';
import styles from './index.module.css';
import axios, { AxiosPromise } from 'axios';
// import { User } from '@mussia12/fullstack/users-api-nest-module';
import { User } from '@mussia12/shared/mongoose-schemas';
import { Button, Grid } from '@mui/material';

const getUsers = () => {
  return axios
    .get<User[]>('/api/users')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      // adding return type of void
      console.log(err);
    });
};

export function Index() {

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    getUsers().then((res) => {
      if (Array.isArray(res)) {
        setUsers(res);
      }
    });
  }, []);
  return (
    <Grid className={styles.page}>
      <h2>Users</h2>
      <Button>Button</Button>
      <Button color="secondary">Button</Button>
      {users.map((user) => {
        return (
          <Grid key={user._id}>
            <Grid>role: {user.role}</Grid>
            <Grid>name: {user.name}</Grid>
            <Grid>email: {user.email}</Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default Index;
