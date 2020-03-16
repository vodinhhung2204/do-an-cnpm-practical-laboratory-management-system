import React, { Component } from 'react';
import firebase from "firebase";
import "./Upload.css";
import {
   Button,
    Label,
    
  } from 'reactstrap';
const storage = firebase.storage();

class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            url: '',
            progress: 0,
            status: false,
        }
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }
    handleChange = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({ image }));
        }
    }
    handleUpload = () => {
        this.setState({status: false});
        const { image } = this.state;
        const mssv = this.props.mssv;
        const uploadTask = storage.ref(`users/image/${mssv}/${mssv}`).put(image);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.setState({ progress });
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage.ref(`users/image/${mssv}/`).child(mssv).getDownloadURL().then(url => {
                    this.setState({ url });
                })
            });
    }
    render() {
        const style = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        };
        var turnButton;
       

        return (
            <div style={style}>
                <br />
                <img src={ this.props.image || this.state.url || 'http://via.placeholder.com/400x300'} alt="Uploaded images" height="240" width="300" />
                <progress hidden="hidden" value={this.state.progress} max="100" />
                <Label for="file-upload" className="custom-file-upload">
                    <i className="fa fa-cloud-upload"></i> Change Image
                </Label>
                <input id="file-upload" type="file" onChange={this.handleChange} onClick={() => this.setState({status: true})}/>
               
                <Button color="primary" onClick={this.handleUpload}>Update Image</Button>
            </div>
        )
    }
}

export default ImageUpload;