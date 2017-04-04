import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import autobind from "react-autobind";

import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Chat from "./Chat.jsx";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            token: localStorage.getItem('token') || "",
        };
        autobind(this);
    }

    handleOnLogin(token) {
        this.setState({
            token: token,
        });
        localStorage.setItem('token', this.state.token);
    }

    render() {
        return (
            <Router>
                <div>
                    {this.state.token ? (
                        <Redirect to="/chat"/>
                    ) : ""}

                    <Route exact path="/" component={Home} />
                    <Route path="/login" render={() => (
                        <Login onLogin={this.handleOnLogin} />
                    )} />
                    <Route path="/register" component={Register} />
                    <Route path="/chat" component={Chat} />
                </div>
            </Router>
        );
    }
}