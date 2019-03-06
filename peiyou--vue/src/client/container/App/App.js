import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from '../Login'
import UserStage from '../Stage'

class App extends Component {
    constructor () {
        super()
    }
    render () {
        return (
            <Switch>
                <Route exact={true} path="/" render={() => {
                    return <Redirect to="/login" />
                }}></Route>
                <Route path="/login" component={Login}></Route>
                <Route path="/userStage" component={UserStage}></Route>
            </Switch>
        )
    }
}
export default App;