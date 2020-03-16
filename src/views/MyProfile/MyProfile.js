import React, { Component } from "react";
import GridItem from "../Grid/GridItem";
import GridContainer from "../Grid/GridContainer.js";

import {
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardHeader,
  Button,
  CardFooter,
  Col, 
  Row 

} from 'reactstrap';
import "./Myprofile.css";
import LabelInput from "../LabelInput/LabelInput";
import { connect } from "react-redux";
import fire from "../../config/fire";
import UploadImage from "../ImageUpload/Upload";

const firebase = require("firebase");
const storage = firebase.storage();
// Required for side-effects
require("firebase/firestore");
var db = fire.firestore();
var DataUser = {};

class UserProfile extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      gender: '',
      mssv: '',
      name: '',
      birthday: '',
      pass:'',
      modalisOpen: false,
      avatars: [],
      status: true,
      statusButton: false,
      typepass: "password",
      image: '',
      classes: {
        cardCategoryWhite: {
          color: "rgba(255,255,255,.62)",
          margin: "0",
          fontSize: "14px",
          marginTop: "0",
          marginBottom: "0"
        },
        cardTitleWhite: {
          color: "#FFFFFF",
          marginTop: "0px",
          minHeight: "auto",
          fontWeight: "300",
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          marginBottom: "3px",
          textDecoration: "none"
        }
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.handleButton = this.handleButton.bind(this);
    this.clickNHold = this.clickNHold.bind(this);
    this.ClickNHoldEnd = this.ClickNHoldEnd.bind(this);
    this.SaveData = this.SaveData.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.CancelChange = this.CancelChange.bind(this);
  }
  async componentDidMount() {
    var docRef = db.collection("students").doc(localStorage.getItem('DataUser'));
    await docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          DataUser = doc.data();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    if (Object.entries(DataUser).length !== 0 && DataUser.constructor === Object) {
      this.setState({
        mssv: DataUser.mssv,
        phone: DataUser.phone,
        name: DataUser.name,
        email: DataUser.email,
        birthday: DataUser.birthday,
        gender: DataUser.gender,
        pass: DataUser.password
      })
    }
    var storageRef = storage.ref();
    var starsRef = storageRef.child(`users/image/${localStorage.getItem('DataUser')}/${localStorage.getItem('DataUser')}`);
    var tmp = '';
    await starsRef.getDownloadURL().then(async function (url) {
      tmp = url
    })
    this.setState({ image: tmp })
  }
  toggleModal() {
    this.setState({
      modalisOpen: !this.state.modalisOpen
    })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  changeStatus() {
    this.props.changeStatus(1)
  }
  onDrop(avatar) {
    this.setState({
      avatars: this.state.avatars.concat(avatar),
    });
  }
  handleButton() {
    this.setState({
      status: true,
    })
  }
  clickNHold() {
    this.setState({
      typepass: "text"
    })
  }
  ClickNHoldEnd() {
    this.setState({
      typepass: "password"
    })
  }
  CancelChange() {
    this.componentDidMount();
    this.setState({
      status: true
    })
  }
  SaveData() {

  }
  handleSubmit(e) {
    db.collection("students").doc(localStorage.getItem('DataUser')).update({
      mssv: this.state.mssv,
      phone: this.state.phone,
      name: this.state.name,
      email: this.state.email,
      birthday: this.state.birthday,
      gender: this.state.gender,
      password: this.state.pass
    })
    this.setState({
      modalisOpen: !this.state.modalisOpen,
      status: true
    })
  }
  render() {
    const status = this.state.status;
    const statusButton = this.state.statusButton;
    var girdChange;
    var personresult;
    var checkperson = parseInt(this.state.mssv);
    if (parseInt(checkperson / 1000000) === 102) {
      personresult = <span>Sinh viên: </span>
    } else {
      personresult = <span>Giảng viên: </span>
    }
    var ButtonChange;
    if (statusButton === false) {
      ButtonChange = <Button onClick={() => this.setState({ typepass: 'text', statusButton: true })}
        style={{ padding: 12 }}
      >
        <span className="fa fa-fw fa-eye field-icon" /></Button>

    }
    if (statusButton === true) {
      ButtonChange = <Button onClick={() => this.setState({ typepass: 'password', statusButton: false })}
        style={{ padding: 12 }}
      >
        <span className="fa fa-fw fa-eye field-icon" /></Button>

    }
    if (status === false) {
      girdChange = <GridItem xs={12} sm={12} md={8}>
        <Card>
          <CardHeader color="primary">
            <h4 className={this.state.classes.cardTitleWhite}>
              Chỉnh sửa thông tin
          </h4>
            <p className={this.state.classes.cardCategoryWhite}>
              Điền thông tin cần chỉnh sửa
          </p>
          </CardHeader>
          <CardBody>
            <Form>
              <FormGroup>
                <Row>
                  <Col sm={3}>
                    <Label
                      style={{ fontWeight: 'bold', fontSize: 16, paddingLeft: 0, paddingTop: 8 }}
                      for="MSSV"
                    >
                      Họ và tên:
                    </Label>
                  </Col>
                  <Col sm={8}>
                    <LabelInput style={{ fontWeight: 'bold', paddingright: 0, paddingTop: 10, fontSize: 16 }}
                      labelClassName="Name"
                      placeholder="name"
                      value={this.state.name}
                      type="text"
                      id="name"
                      name="name"
                      onChange={this.handleInputChange}
                    ></LabelInput>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col sm={3}>
                    <Label
                      style={{ fontWeight: 'bold', fontSize: 16, paddingLeft: 0, paddingTop: 8 }}
                      for="Email"
                    >
                      Email:
                    </Label>
                  </Col>
                  <Col sm={8}>
                    <LabelInput style={{ fontWeight: 'bold', paddingright: 0, paddingTop: 10, fontSize: 16 }}
                      labelClassName="Email"
                      placeholder="Email"
                      value={this.state.email}
                      type="text"
                      id="email"
                      name="email"
                      onChange={this.handleInputChange}
                    ></LabelInput>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col sm={3}>
                    <Label
                      style={{ fontWeight: 'bold', fontSize: 16, paddingLeft: 0, paddingTop: 8 }}
                      for="Phone"
                    >
                      Số điện thoại:
                    </Label>
                  </Col>
                  <Col sm={8}>
                    <LabelInput style={{ fontWeight: 'bold', paddingright: 0, paddingTop: 10, fontSize: 16 }}
                      labelClassName="Phone"
                      placeholder="Phone"
                      value={this.state.phone}
                      type="text"
                      id="phone"
                      name="phone"
                      onChange={this.handleInputChange}
                    ></LabelInput>
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup>
                <Row>
                  <Col sm={3}>
                    <Label
                      style={{ fontWeight: 'bold', fontSize: 16, paddingLeft: 0, paddingTop: 8 }}
                      for="Birthday"
                    >
                      Ngày sinh:
                    </Label>
                  </Col>
                  <Col sm={8}>
                    <LabelInput style={{ fontWeight: 'bold', paddingright: 0, paddingTop: 10, fontSize: 16 }}
                      labelClassName="Birthday"
                      placeholder="Birthday"
                      value={this.state.birthday}
                      type="text"
                      id="birthday"
                      name="birthday"
                      onChange={this.handleInputChange}
                    ></LabelInput>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col sm={3}>
                    <Label
                      style={{ fontWeight: 'bold', fontSize: 16, paddingLeft: 0, paddingTop: 8 }}
                      for="Gender"
                    >
                      Giới tính:
                    </Label>
                  </Col>
                  <Col sm={8}>
                    <LabelInput style={{ fontWeight: 'bold', paddingright: 0, paddingTop: 10, fontSize: 16 }}
                      labelClassName="Gender"
                      placeholder="Gender"
                      value={this.state.gender}
                      type="text"
                      id="gender"
                      name="gender"
                      onChange={this.handleInputChange}
                    ></LabelInput>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col sm={3}>
                    <Label
                      style={{ fontWeight: 'bold', fontSize: 16, paddingLeft: 0, paddingTop: 8 }}
                      for="Password"
                    >
                      Mật Khẩu:
                    </Label>
                  </Col>
                  <Col sm={8}>
                    <LabelInput style={{ fontWeight: 'bold', paddingright: 0, paddingTop: 10, fontSize: 16 }}
                      labelClassName="Password"
                      placeholder="Password"
                      value={this.state.pass}
                      type="text"
                      id="pass"
                      name="pass"
                      onChange={this.handleInputChange}
                    ></LabelInput>
                  </Col>
                </Row>
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter>
            <Button sm={5} color="success" onClick={this.toggleModal} style={{ marginLeft: 'auto' }}>Lưu lại</Button>
            <Button color="gray" onClick={this.CancelChange}> Huỷ bỏ
          </Button>
          </CardFooter>
        </Card>
      </GridItem>;
    }
    else {
      girdChange = <GridItem xs={12} sm={12} md={8}>
        <Card>
          <CardBody>
            <Form onSubmit={this.handleChangeProfile}>
              <CardHeader color="primary">
                <h4 className={this.state.classes.cardTitleWhite}>
                  THÔNG TIN CÁ NHÂN
                </h4>
              </CardHeader>
              <FormGroup></FormGroup>
              <FormGroup>
                <Row>
                  <Col sm={4}>
                    <Label
                      style={{ fontWeight: 'bold', fontSize: 16 }}
                      for="MSSV"
                    >
                      Mã số sinh viên:
                    </Label>
                  </Col>
                  <Col>
                    <Label style={{ fontSize: 16, color: 'rgb(97, 95, 95)' }}>{this.state.mssv}</Label>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col sm={4}>
                    <Label for="gender" style={{ fontWeight: 'bold', fontSize: 16 }}>
                      Họ và tên:
                    </Label>
                  </Col>
                  <Col>
                    <Label style={{ fontSize: 16, color: 'rgb(97, 95, 95)' }}>{this.state.name}</Label>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col sm={4}>
                    <Label style={{ fontWeight: 'bold', fontSize: 16 }} for="Email">
                      Email:
                    </Label>
                  </Col>
                  <Col>
                    <Label style={{ fontSize: 16, color: 'rgb(97, 95, 95)' }}>{this.state.email}</Label>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col sm={4}>
                    <Label for="Phone" style={{ fontWeight: 'bold', fontSize: 16 }}>
                      Số điện thoại:
                    </Label>
                  </Col>
                  <Col>
                    <Label style={{ fontSize: 16, color: 'rgb(97, 95, 95)' }}>{this.state.phone}</Label>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col sm={4}>
                    <Label for="gender" style={{ fontWeight: 'bold', fontSize: 16 }}>
                      Giới tính:
                    </Label>
                  </Col>
                  <Col>
                    <Label style={{ fontSize: 16, color: 'rgb(97, 95, 95)' }}>{this.state.gender}</Label>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col sm={3}>
                    <Label for="gender" style={{ fontWeight: 'bold', paddingright: 0, paddingTop: 10, fontSize: 16 }}>
                      Mật khẩu:
                    </Label>
                  </Col>
                  <Col md={5}>
                    <LabelInput type={this.state.typepass} value={this.state.pass} 
                      onChange={this.handleInputChange}
                      className="typepassword"
                      style={{ fontSize: 16, color: 'rgb(97, 95, 95)' }}>{this.state.pass}</LabelInput>
                  </Col>
                  <Col>
                    {ButtonChange}
                  </Col>
                </Row>
              </FormGroup>
              <div style={{ textAlign: 'right' }}>
                <Button color="primary" style={{ display: 'float', fontSize: 16 }} onClick={() => this.setState({ status: false })}>
                  Chỉnh sửa thông tin
          </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </GridItem>;
    }
    return (
      <div>
        <Modal id="articleModal" isOpen={this.state.modalisOpen}
          toggle={this.toggleModal.bind(this)} className={this.props.className}
        >
          <p></p>
          <h3 className="modal-title" id="myModallabel" style={{ fontSize: 24, fontWeight: "bold", paddingLeft: 16 }}>Xác nhận thông tin</h3>
          <ModalBody>
            <Form encType="multipart/form-data" onSubmit={this.handleSubmit} noValidate>
              Bạn chắc chắn muốn thay đổi thông tin cá nhân chứ?
                          </Form>
          </ModalBody>
          <ModalFooter>
            <Button id="abc" type="submit" color="success" className="success ml-auto" onClick={this.toggleModal.bind(this)} onClick={e => this.handleSubmit(e)}>Xác nhận</Button>{' '}
            <Button id="abc" type="Button" className="second" onClick={this.toggleModal.bind(this)}>Huỷ bỏ</Button>
          </ModalFooter>
        </Modal>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card >
              {/* <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={avatar} alt="..." />
                </a>
              </CardAvatar> */}
              <UploadImage mssv={this.state.mssv} image={this.state.image}></UploadImage>
              <CardBody >
                <h4 className={this.state.classes.cardTitle}>{personresult}{this.state.name}</h4>
                <h6 className={this.state.classes.cardCategory}>
                  MSSV: {this.state.mssv}
                </h6>
              </CardBody>
            </Card>
          </GridItem>
          {girdChange}
        </GridContainer>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)