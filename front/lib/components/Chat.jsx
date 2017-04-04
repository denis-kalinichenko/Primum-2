import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import autobind from "react-autobind";

export default class Chat extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            authError: false,
        };
        autobind(this);
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        fetch('http://127.0.0.1:3000/user/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.status !== "error") {
                this.setState({
                    users: json,
                });
            } else {
                alert(json.message);
                // localStorage.removeItem('token');
                this.setState({
                    authError: true,
                });
            }
        });
    }

    render() {
        return (
            <div>
                {this.state.authError ? (
                    <Redirect to="/login" />
                ) : ""}
                <div>Chat</div>
                {
                    this.state.users.map(function(user) {
                        return <div key={user._id}>{user.username}</div>
                    })
                }
            </div>
        );
    }
};