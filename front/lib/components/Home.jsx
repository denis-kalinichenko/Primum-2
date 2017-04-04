import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <h1>Hello World</h1>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        );
    }
}