import React, { Component } from 'react';
import autobind from "react-autobind";
import { Redirect } from 'react-router';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            token: "",
        };
        autobind(this);
    }

    handleUsernameChange(event) {
        this.setState({
            username: event.target.value,
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('http://127.0.0.1:3000/user/token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            }),
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.status === "success") {
                this.setState({
                    token: json.token,
                });
                this.props.onLogin(this.state.token);
            } else {
                alert(json.error);
            }
        });
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <h1>Login</h1>
                {this.state.token ? (
                    <Redirect to="/" />
                ): ""}
                <form onSubmit={this.handleSubmit}>
                    <input
                        placeholder="username"
                        ref="email"
                        type="text"
                        value={this.state.username}
                        onChange={this.handleUsernameChange}
                        minLength="5"
                        required
                    />
                    <input
                        placeholder="password"
                        ref="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        minLength="5"
                        required
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
}

Login.propTypes = {
    onLogin: React.PropTypes.func.isRequired,
};