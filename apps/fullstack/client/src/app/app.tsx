import React, { useEffect } from 'react';
import { Route, Link, Routes } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as Logo } from './logo.svg';
import styles from './app.module.css';
import star from './star.svg';

import { User } from '@mussia12/shared/mongoose-schemas';

function getUsers() {
  return axios
    .get<Array<User>>('/api/users')
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log('err', err);
    });
}

const A = () => {
  return <div>hello from A</div>;
};

const B = () => {
  return <div>hello from B</div>;
};

export function App() {
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className={styles.app}>
      <header className="flex">
        <h1>Welcome to client!</h1>
      </header>
      <main>
        <h2>Next Steps</h2>
      </main>

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route path="/" element={<A />} />
        <Route path="/page-2" element={<B />} />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
