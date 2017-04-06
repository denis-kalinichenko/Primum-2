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
            logged: false,
        };
        autobind(this);
    }

    componentDidMount() {
        if (localStorage.getItem('token')) {
            this.setState({
                logged: true,
            });
        }
    }

    handleOnLogin(token) {
        localStorage.setItem('token', token);
        this.setState({
            logged: true,
        });
    }

    handleOnLogout() {
        localStorage.removeItem("token");
        this.setState({
            logged: false,
        });
    }

    render() {
        return (
            <Router>
                <div>
                    {this.state.logged ? (
                        <Redirect to="/chat"/>
                    ) : ""}

                    <Route exact path="/" component={Home} />
                    <Route exact path="/login" render={() => (
                        <Login onLogin={this.handleOnLogin} />
                    )} />
                    <Route exact path="/register" component={Register} />
                    <Route path="/chat" render={() => (
                        <Chat onLogout={this.handleOnLogout} />
                    )} />
                </div>
            </Router>
        );
    }
}