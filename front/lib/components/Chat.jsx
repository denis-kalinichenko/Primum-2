import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import autobind from "react-autobind";

import RoomForm from "./RoomForm.jsx";

export default class Chat extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            authError: false,
            layout: null,
            roomId: null,
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
                this.logout();
                this.setState({
                    authError: true,
                });
            }
        });
    }

    logout() {
        this.props.onLogout();
        this.setState({
            authError: true,
        });
    }

    changeLayout(name) {
        this.setState({ layout: name, });
    }

    handleRoomCreate(room) {
        this.setState({
            layout: "room",
            roomId: room._id,
        });
    }

    render() {
        return (
            <div>
                {this.state.authError ? (
                    <Redirect to="/" />
                ) : ""}
                <button type="button" onClick={this.logout}>Logout</button>
                <h1>Chat</h1>

                {this.state.layout === null ? (
                    <div>
                        <button onClick={() => this.changeLayout("roomForm") }>Create new room</button>
                        <h3>Welcome!</h3>
                    </div>
                ) : ""}

                {this.state.layout === "roomForm" ? ( <RoomForm users={this.state.users} onCreate={this.handleRoomCreate} /> ) : ""}
            </div>
        );
    }
};

Chat.propTypes = {
    onLogout: React.PropTypes.func.isRequired,
};