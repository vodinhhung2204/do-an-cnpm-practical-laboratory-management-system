import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom'

import * as action from "../../../action/index";
import "./Login.css";
import {
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Alert
} from "reactstrap";
import LabelInput from "../../LabelInput/LabelInput";
import fire from "../../../config/fire";
//const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
var db = fire.firestore();
var DataUser = {};
class Login extends Component {
  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      mssv: "",
      password: "",
      dataUser: {}
    };
    this.loginSubmit = this.loginSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleKeyPress = (event) => {
    if(event.keyCode === 13){
      return this.loginSubmit(event);
    }
  }
  async loginSubmit(e) {
    e.preventDefault();
    let pass_tmp = this.state.password;
    //let mssv_tmp = this.state.mssv;
    var docRef = db.collection("students").doc(this.state.mssv);
    await docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          if (pass_tmp === doc.data().password) {
            DataUser = doc.data();
          } else {
            alert("Sai mat khau dcm");
          }
        } else {
          alert("deo ton tai tai khoan nay");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    if (Object.entries(DataUser).length !== 0 && DataUser.constructor === Object) {
      await this.props.onSetUser(DataUser);
      await localStorage.setItem('DataUser', DataUser.mssv)
      await this.setState({ dataUser: DataUser });
      var checkLogin = localStorage.getItem('DataUser');
      if (checkLogin !== null) {
        return <Redirect to={
          {
            pathname: '/admin',
          }
        }></Redirect>
      }
    }
  }

  render() {
    var checkLogin = localStorage.getItem('DataUser');
    if (checkLogin !== null) {
      return <Redirect to={
        {
          pathname: '/Home',
        }
      }></Redirect>
    }
    return (
      <div className="container login-container">
        <div className="container-frame">
          <div className="login-form">
            <div className="login-title">
              <Row>
                <div className="logodesign">
                <img src={require("../../../images/logo.jpg")}
                    alt="logo"
                    style={{ width: "70%" }}></img> 
                </div>
                <div>

                  <p style={{ paddingTop: 20, marginBottom: 10 }} className="titledesign">
                    PRACTICAL LABORATORY MANAGEMENT SYSTEM
              </p>


                </div>
              </Row>
            </div>

            <Row>
              <Col sm="12" md="4"></Col>
              <Col sm="12">
                <div className="linedesign"></div>
                <Form>
                  <FormGroup className="text-center">

                  </FormGroup>
                  <FormGroup className="formData" onKeyUp={this.handleKeyPress}>
                    <LabelInput className="login-input-text"
                      placeholder="Mssv"
                      labelClassName="Mssv"
                      value={this.state.username}
                      type="text"
                      id="mssv"
                      name="mssv"
                      onChange={this.handleInputChange}
                    ><i class="fa fa-user" aria-hidden="true"></i>
                    </LabelInput>

                    <LabelInput className="login-input-text"
                      placeholder="Password"
                      labelClassName="Password"
                      value={this.state.password}
                      type="password"
                      id="password"
                      name="password"
                      onChange={this.handleInputChange}
                    ><i class="fa fa-lock" aria-hidden="true"></i></LabelInput>

                  </FormGroup>
                  <FormGroup>
                    <Alert color={this.state.colorError} style={{ display: 'none' }}>
                      {this.state.message}
                    </Alert>
                  </FormGroup>
                  <FormGroup className="text-center">
                    <Button onClick={this.loginSubmit} className="login-button">
                      LOGIN
                </Button>{" "}
                  </FormGroup>
                </Form>
                <div className="linedesign"></div>
                <p color="black">ITF - INFORMATION TECHNOLOGY FACULTY</p>
              </Col>

            </Row>

          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onSetUser: data => {
      dispatch(action.setUser(data));
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
