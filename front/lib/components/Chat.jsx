import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import autobind from "react-autobind";

import RoomForm from "./RoomForm.jsx";

export default class Chat extends Component {
    constructor() {
        super();
        this.state = {
            rooms: [],
            authError: false,
            layout: null,
            roomId: null,
        };
        autobind(this);
    }

    componentDidMount() {
        this.getRooms();
    }

    getRooms() {
        fetch('http://127.0.0.1:3000/room/', {
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
                    rooms: json,
                });
            } else {
                this.logout();
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
            layout: null,
        });
        this.getRooms();
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
                        {
                            this.state.rooms.map(function (room) {
                                return <div key={room._id}>{room.name ? room.name : `Room #${room._id}`}</div>
                            })
                        }
                    </div>
                ) : ""}

                {this.state.layout === "roomForm" ? (
                    <RoomForm
                        onCreate={this.handleRoomCreate}
                        onCancel={() => this.changeLayout(null)}
                        onLogout={this.logout}
                    />
                ) : ""}
            </div>
        );
    }
};

Chat.propTypes = {
    onLogout: React.PropTypes.func.isRequired,
};