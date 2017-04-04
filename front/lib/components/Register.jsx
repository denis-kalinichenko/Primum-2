import React, { Component } from 'react';
import autobind from "react-autobind";
import { Redirect } from 'react-router';

export default class Register extends Component {
    constructor() {
        super();

        this.state = {
            username: "",
            password: "",
            success: false,
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
        fetch('http://127.0.0.1:3000/user', {
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
                    success: true,
                });
            } else {
                alert(json.error);
            }
        });
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                {this.state.success ? (
                    <Redirect to="/login"/>
                ) : ""}
                <h1>Register</h1>
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
                    <button type="submit">Create account</button>
                </form>
            </div>
        );
    }
}