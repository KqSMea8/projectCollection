import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import { getUserName, getPassword } from '../../Redux/actions'

class Login extends Component {
    constructor (props) {
        super(props)
        this.state = {
            userPwd:[]
        }
    }
    componentDidMount () {
        this.getUserPwd();
    }
    getUserPwd () {
        axios({
            methods:'GET',
            url:'/getUserPwd'
        }).then((res) => {
            if (res.status === 200) {
                this.setState({
                    userPwd:res.data
                })
            }
        })
    }
    loginClick (e) {
        e.preventDefault();
        const { dispatch } = this.props;
        // redux 传值axios获取数据进行判断
        const myUserName = this.myUserName.value;
        const myPassword = this.myPassword.value;
        dispatch(getUserName(myUserName));
        dispatch(getPassword(myPassword));
        // axios获取数据
        this.state.userPwd.map((val, key) => {
            if (val.userName == myUserName && val.password == myPassword) {
                this.props.history.push('/userStage')
            } else {
                this.yz.innerHTML = '账号或密码错误，请重新输入';
            }
        })
    }
    render () {
        return (
            <div className="login">
                <h1>学而思培优数据平台</h1>
                <form>
                    <img src={require('../../static/assets/login_icon_urer@2x.png')} className="login_icon_urer" />
                    <input type="text" placeholder="请输入用户名" ref={(userName) => {this.myUserName=userName}} />
                    <img src={require('../../static/assets/login_icon_password@2x.png')} className="login_icon_password" />
                    <input type="password" placeholder="请输入密码"  ref={(password) => {this.myPassword=password}} />
                    <p ref={(p) => this.yz = p}></p>
                    <button onClick={this.loginClick.bind(this)}>登录</button>
                </form>
            </div>
        )
    }
}
const select = (state) => {
    return {
        myUserName:state.myUserName,
        myPassword:state.myPassword
    }
}
export default connect(select)(Login);