import React, { Component } from 'react';
import autobind from "react-autobind";

export default class Room extends Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            room: {
                _id: null,
                name: null,
                members: [],
            },
        };
    }

    componentDidMount() {
        this.fetchRoom();
    }

    fetchRoom() {
        fetch('http://127.0.0.1:3000/room/' + this.props.id, {
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
                    room: json,
                });
            } else {
                this.props.onLogout();
            }
        });
    }

    leaveRoom() {
        fetch(`http://127.0.0.1:3000/room/${this.props.id}/leave`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.status !== "error") {
                this.props.onBack();
            } else {
                this.props.onLogout();
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <div><button type="button" onClick={this.props.onBack}>Back</button></div>
                <h3>{this.state.room.name || 'Room #' + this.state.room._id}</h3>
                <button type="button" onClick={this.leaveRoom}>Leave</button>
                <p>
                    Members:
                    {
                        this.state.room.members.map(member => {
                            return <span key={member._id}>@{member.username} </span>;
                        })
                    }
                </p>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <textarea
                            placeholder="Message..."
                            name="message"
                            id="message"
                            ref="message"
                            cols="30"
                            rows="10">
                        </textarea>
                        <br/>
                        <button type="submit">Send message</button>
                    </form>
                </div>
            </div>
        );
    }
}

Room.propTypes = {
    id: React.PropTypes.string.isRequired,
    onLogout: React.PropTypes.func.isRequired,
    onBack: React.PropTypes.func.isRequired,
};