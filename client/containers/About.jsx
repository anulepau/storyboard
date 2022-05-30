import React, { Component } from 'react'; 
import Navigation from '../components/Navigation';
import  { Navigate } from 'react-router-dom'

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }

    render() {
        if (this.state.redirect) return <Navigate to='/' />;
        return (
            <>
                <Navigation />    
                <div className="profile">
                    <button id="purpleB" className="field" onClick={() => {this.props.changePostColor('#E6E6FA'); this.setState({ redirect: true });}}>Purple</button>
                    <button id="greenB" className="field" onClick={() => {this.props.changePostColor('#B5EAAA'); this.setState({ redirect: true });}}>Green</button>
                    <button id="yellowB" className="field" onClick={() => {this.props.changePostColor('#EEE8AA'); this.setState({ redirect: true });}}>Yellow</button>
                    <button id="blueB" className="field" onClick={() => {this.props.changePostColor('#B0E0E6'); this.setState({ redirect: true });}}>Blue</button>
                    <button id="pinkB" className="field" onClick={() => {this.props.changePostColor('#FFC0CB'); this.setState({ redirect: true });}}>Pink</button>
                </div>
            </>
        )
    }
    
}

export default About;