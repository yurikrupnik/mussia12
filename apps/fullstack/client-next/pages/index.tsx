import { useEffect, useState } from 'react';
import styles from './index.module.css';
import axios, { AxiosPromise } from 'axios';
// import { User } from '@mussia12/fullstack/users-api-nest-module';
import { User } from '@mussia12/shared/mongoose-schemas';

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
    <div className={styles.page}>
      <h2>Users</h2>
      {users.map((user) => {
        return (
          <div key={user._id}>
            <div>role: {user.role}</div>
            <div>name: {user.name}</div>
            <div>email: {user.email}</div>
          </div>
        );
      })}
      <p>Thank you for using and showing some ♥ for Nx.</p>
    </div>
  );
}

export default Index;
