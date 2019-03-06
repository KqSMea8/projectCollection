import React from 'react';
import { connect } from 'dva';
import styles from './Login.css';
import LoginPage from '../components/logins/Login';

function Login() {
  return (
    <div className={styles.normal}>
      <LoginPage />
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Login);
