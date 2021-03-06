import React, {Component} from "react";
import autobind from "react-autobind";
import ArrayFrom from 'array.from';

export default class RoomForm extends Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            users: [],
            name: "",
            selectedUsers: [],
            room: null,
        };
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
                this.props.onLogout();
            }
        });
    }

    handleNameChange(event) {
        this.setState({
            name: event.target.value,
        });
    }

    handleSelectedUsersChange(event) {
        const selected = event.target.querySelectorAll('option:checked');
        this.setState({
            selectedUsers: ArrayFrom(selected).map(el => el.value),
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('http://127.0.0.1:3000/room', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                name: this.state.name,
                users: this.state.selectedUsers,
            }),
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.status === "success") {
                this.setState({
                    room: json.room,
                });
                this.props.onCreate(this.state.room);
            } else {
                alert(json.error);
            }
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>New room</h3>
                <label htmlFor="roomName">Name:</label>
                <br/>
                <input
                    placeholder="Name"
                    type="text"
                    name="name"
                    ref="name"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                />
                <br/>
                <label htmlFor="selectedUsers">Select user(s):</label>
                <br/>
                <select
                    id="selectedUsers"
                    name="selectedUsers"
                    ref="selectedUsers"
                    multiple
                    onChange={this.handleSelectedUsersChange}
                >
                    {
                        this.state.users.map(function (user) {
                            return <option key={user._id} value={user._id}>{user.username}</option>
                        })
                    }
                </select>
                <br/>
                <button type="submit">Create</button>
                <button type="button" onClick={this.props.onCancel}>Cancel</button>
            </form>
        );
    }
}

RoomForm.propTypes = {
    onCreate: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onLogout: React.PropTypes.func.isRequired,
};