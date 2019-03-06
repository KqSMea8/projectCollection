import React from 'react';
import { Icon } from 'antd';
import styles from './Login.css';

function Login() {
  // const phoneReg = /^1[3,4,5,7,8]\d{9}$/;
  return (
    <div className={styles.normal}>
      <header className={styles.head}>
        <a><Icon type="left" /><span>返回</span><span>关闭</span></a>
        <a>会员注册</a>
        <a><Icon type="ellipsis" /></a>
      </header>
      <section className={styles.section}>
        <div className={styles.userverify}>
          <input type="text" placeholder="手机号" />
          <input type="password" placeholder="密码" />
          <button onClick={() => {
            console.log(111);
          }}>登录</button>
          <p>
            <input type="checkbox" defaultChecked="checked" />
            <span>我已同意阅读&nbsp;哗啦啦用户协议</span>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
