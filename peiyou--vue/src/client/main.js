import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import reducer from './Redux/reducer'
import App from './container/App'
import './Services'
import './static/css/style.css'

const store = createStore(reducer)
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.getElementById("app")
)