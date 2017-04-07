import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import autobind from "react-autobind";

import RoomForm from "./RoomForm.jsx";
import Room from "./Room.jsx";

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
        this.getRooms();
    }

    handleRoomCreate(room) {
        this.changeLayout(null);
    }

    openRoom(roomId) {
        this.setState({
            layout: "room",
            roomId: roomId,
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
                        <p>Choose room:</p>
                        {
                            this.state.rooms.map(room => {
                                return <div key={room._id}>
                                    <button
                                        type="button"
                                        onClick={() => this.openRoom(room._id)}
                                    >
                                        {room.name ? room.name : `Room #${room._id}`}
                                    </button>
                                </div>
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

                {this.state.layout === "room" ? (
                    <Room
                        id={this.state.roomId}
                        onLogout={this.logout}
                        onBack={() => this.changeLayout(null)}
                    />
                ) : ""}
            </div>
        );
    }
};

Chat.propTypes = {
    onLogout: React.PropTypes.func.isRequired,
};