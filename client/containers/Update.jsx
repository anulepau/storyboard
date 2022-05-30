import React, { Component } from 'react';
import Navigation from '../components/Navigation';
import  { Navigate } from 'react-router-dom'

class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            content: this.props.content,
            errorMessage: null,
            redirect: false,
            cancel: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    handleSubmit() {
        const { title, content } = this.state; 
        const postInfo = {
            _id: this.props.id,
            title: title,
            content: content 
        }  

        fetch(`/api`, {
            method: 'PATCH',
            body: JSON.stringify(postInfo),
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
        })
          .then(res => {
            if (res.ok) return res.json();
            else throw 'Invalid or missing input fields';
          })
          .then(newPost => {    
            this.props.updatePost(newPost, this.props.id);  
            this.setState({ title: '', content: '', errorMessage: null, redirect: true})
          })
          .catch(err => { 
            this.setState({ ... this.state, errorMessage: `${err}` })
          })
    }

    // allows user to type in input fields
    handleInput(e) {
        const { id, value } = e.target; 
        this.setState({ [id] : value });  
    }

    cancel() {
        this.setState({ ... this.state, cancel: true });
    }

    render() {
        if ((this.state.redirect && !this.state.errorMessage) || this.state.cancel) return <Navigate to='/'/>;
        // if (this.state.cancel) return <Navigate to='/'/>;
        return (
            <> 
            <Navigation />  
            <div className="form">
                <div className="field"><label htmlFor="title">TITLE </label>
                <div className="field">
                    </div><input id="title" maxLength="100" value={this.state.title} onChange={this.handleInput}></input>
                </div>

                <div className="field"><label htmlFor="content">IDEA </label></div>
                <div className="field">
                    <textarea id="content" rows="20" cols="20" value={this.state.content} onChange={this.handleInput}></textarea>
                </div>
                <div className="field" id="updateCancel">
                <button id="submitButton" onClick={this.handleSubmit}>UPDATE</button>
                <button id="cancelButton" onClick={this.cancel}>cancel</button>
                </div>
                {this.state.errorMessage && 
                    <div className="error"> {this.state.errorMessage} </div>}
            </div> 
            </>   
        )
    }
}

export default Update; 