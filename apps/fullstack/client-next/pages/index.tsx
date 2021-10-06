import { useEffect, useState } from 'react';
import styles from './index.module.css';
import axios, { AxiosPromise } from 'axios';
// import { User } from '@mussia12/fullstack/users-api-nest-module';
import { User } from '@mussia12/shared/mongoose-schemas';

const getUsers = () => {
  return axios
    .get('/api/users')
    .then((res): AxiosPromise<User[]> => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    getUsers().then((res) => {
      console.log('res', res);
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
      <div className="flex github-star-container">
        <a
          href="https://github.com/nrwl/nx"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          If you like Nx, please give it a star:
          <div className="github-star-badge">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/star.svg" className="material-icons" alt="" />
            Star
          </div>
        </a>
      </div>
    </div>
  );
}

export default Index;
