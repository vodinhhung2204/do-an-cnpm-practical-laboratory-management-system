import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader,
  Col, Pagination, PaginationItem, PaginationLink, Row, Table,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Alert
} from 'reactstrap';
import fire from "../../../config/fire";
import { isTerminatorless } from '@babel/types';
import { Button, Input } from '@material-ui/core';
import Alerts from '../../Notifications/Alerts/Alerts';

const firebase = require("firebase");
const storage = firebase.storage();
// Required for side-effects
require("firebase/firestore");
var db = fire.firestore();
var idfinal = null;
class Students extends Component {
  constructor() {
    super()
    this.state = {
      liststudents: [],
      modalisOpen: false,
      modalisOpenToEdit: false,
      modalisOpenToAdd: false,
      idstudentCurrent: '',
      idNewstudent: idfinal,
      birthday: '',
      email: '',
      name: '',
      gender: '',
      phone: '',
      listCurrentstudent: [],
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleModalEdit = this.toggleModalEdit.bind(this);
    this.toggleModalAdd = this.toggleModalAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.GetstudentObject = this.GetstudentObject.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  async componentDidMount() {
    var listTmp = this.state.liststudents.slice();
    await db.collection("students").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var student_tmp = {
          id: doc.id,
          name: doc.data().name,
          birthday: doc.data().birthday,
          email: doc.data().email,
          gender: doc.data().gender,
          phone: doc.data().phone,
        }
        listTmp.push(student_tmp)
        idfinal = Number(student_tmp.id)+1;
      });
    })
    this.setState({
      liststudents: listTmp
    })
  }
  handleDelete() {
    db.collection("students").doc(this.state.idstudentCurrent).delete().then(function () {
      setTimeout(function(){
        document.location.reload();
    }, 1000)
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }
  handleAdd() {
    db.collection("students").doc(String(idfinal)).set({
      name: this.state.name,
      birthday: this.state.birthday,
      email: this.state.email,
      phone: this.state.phone,
      mssv: String(idfinal),
      password: "123456"
  })
  .then(function() {
    setTimeout(function(){
      document.location.reload();
  }, 1000)
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });
  }
  handleEdit() {
    var updatestudent = db.collection("students").doc(this.state.idstudentCurrent);

    // Set the "capital" field of the city 'DC'
    return updatestudent.update({
      "name" : this.state.name,
      "birthday": this.state.birthday,
      "email": this.state.email,
      "gender": this.state.gender,
      "phone": this.state.phone
    })
      .then(function () {
        Alert("Document successfully updated!");
        setTimeout(function(){
          document.location.reload();
      }, 1000)
        
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
      
  }
  toggleModal = value => event => {
    this.setState({
      modalisOpen: !this.state.modalisOpen,
      idstudentCurrent: value
    })
  }
  toggleModalEdit = value => event => {
    this.setState({
      modalisOpenToEdit: !this.state.modalisOpenToEdit,
      idstudentCurrent: value
    })
  }
  toggleModalAdd = event => {
    this.setState({
      modalisOpenToAdd: !this.state.modalisOpenToAdd,
      
    })
  }
  // GetValueAll = item => {
  //   this.setState({
  //    listCurrentstudent : item
  //   })
  //   console.log(this.state.listCurrentstudent)
  // }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  GetstudentObject = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  render() {
    return (
      <div className="animated fadeIn">
        <Modal id="articleModal" isOpen={this.state.modalisOpen}
          toggle={this.toggleModal.bind(this)} className={this.props.className}
        >
          <p></p>
          <h3 className="modal-title" id="myModallabel" style={{ fontSize: 24, fontWeight: "bold", paddingLeft: 16 }}>Xác nhận thông tin</h3>
          <ModalBody>
            <Form encType="multipart/form-data" onSubmit={this.handleSubmit} noValidate>
              Bạn chắc chắn muốn xoá thông tin phòng này chứ?
                          </Form>
          </ModalBody>
          <ModalFooter>
            <Button id="abc" type="submit" color="success" className="success ml-auto"
            style={{background: "darkgreen", color: "white"}}
              onClick={this.toggleModal("0").bind(this)} onClick={e => this.handleDelete()}>Xác nhận</Button>{' '}
            <Button id="abc" type="Button" className="second" 
            style={{background: "gray", color: "white"}}
            onClick={this.toggleModal("0").bind(this)}>Huỷ bỏ</Button>
          </ModalFooter>
        </Modal>
        <Modal id="articleModalEdit" isOpen={this.state.modalisOpenToEdit}
          toggle={this.toggleModalEdit("0").bind(this)} className={this.props.className}
        >
          <p></p>
          <h3 className="modal-title" id="myModallabelEdit" style={{ fontSize: 24, fontWeight: "bold", paddingLeft: 16 }}>Cập nhật thông tin</h3>
          <ModalBody>
            <Form encType="multipart/form-data" onSubmit={this.handleSubmit} noValidate>
              Điền đầy đủ thông tin 
                          </Form>
                          <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                    <th>Tên sinh viên</th>
                      <th>Ngày sinh</th>
                      <th>Địa chỉ email</th>
                      <th>Giới tính</th>
                      <th>Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody onChange={this.GetstudentObject}>
                     <tr>
                           <td><Input 
                      labelClassName="Name"
                      placeholder=""
                      value={this.state.name}
                      type="text"
                      id="name"
                      name="name"
                      onChange={this.handleInputChange}
                    /></td>
                           <td><Input 
                      labelClassName="birthday"
                      placeholder=""
                      value={this.state.birthday}
                      type="text"
                      id="birthday"
                      name="birthday"
                      onChange={this.handleInputChange}/></td>
                          <td><Input 
                      labelClassName="email"
                      placeholder=""
                      value={this.state.email}
                      type="text"
                      id="email"
                      name="email"
                      onChange={this.handleInputChange}/></td>
                      <td><Input 
                      labelClassName="gender"
                      placeholder=""
                      value={this.state.gender}
                      type="text"
                      id="gender"
                      name="gender"
                      onChange={this.handleInputChange}/></td>
                      <td><Input 
                      labelClassName="phone"
                      placeholder=""
                      value={this.state.phone}
                      type="text"
                      id="phone"
                      name="phone"
                      onChange={this.handleInputChange}/></td>
                        </tr>      
                  </tbody>
                </Table>
          </ModalBody>
          <ModalFooter>
            <Button id="abcEdit" type="submit" color="success" className="success ml-auto"
             style={{background: "darkgreen", color: "white"}}
                onClick={this.toggleModalEdit("0").bind(this)} onClick={e => this.handleEdit()}>Lưu thay đổi</Button>{' '}
            <Button id="abcEdit" type="Button" className="second" 
             style={{background: "gray", color: "white"}}
            onClick={this.toggleModalEdit("0").bind(this)}>Huỷ bỏ</Button>
          </ModalFooter>
        </Modal>
        <Modal id="articleModalAdd" isOpen={this.state.modalisOpenToAdd}
          toggle={this.toggleModalAdd.bind(this)} className={this.props.className}
        >
          <p></p>
          <h3 className="modal-title" id="myModallabelAdd" style={{ fontSize: 24, fontWeight: "bold", paddingLeft: 16 }}>Thêm phòng mới</h3>
          <ModalBody>
            <Form encType="multipart/form-data" onSubmit={this.handleSubmit} noValidate>
              Điền đầy đủ thông tin
                          </Form>
                          <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                    <th>Tên sinh viên</th>
                      <th>Ngày sinh</th>
                      <th>Địa chỉ email</th>
                      <th>Giới tính</th>
                      <th>Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody onChange={this.GetstudentObject}>
                     <tr>
                           <td><Input 
                      labelClassName="Name"
                      placeholder=""
                      value={this.state.name}
                      type="text"
                      id="name"
                      name="name"
                      onChange={this.handleInputChange}
                    /></td>
                           <td><Input 
                      labelClassName="birthday"
                      placeholder=""
                      value={this.state.birthday}
                      type="text"
                      id="birthday"
                      name="birthday"
                      onChange={this.handleInputChange}/></td>
                          <td><Input 
                      labelClassName="email"
                      placeholder=""
                      value={this.state.email}
                      type="text"
                      id="email"
                      name="email"
                      onChange={this.handleInputChange}/></td>
                      <td><Input 
                      labelClassName="gender"
                      placeholder=""
                      value={this.state.gender}
                      type="text"
                      id="gender"
                      name="gender"
                      onChange={this.handleInputChange}/></td>
                      <td><Input 
                      labelClassName="phone"
                      placeholder=""
                      value={this.state.phone}
                      type="text"
                      id="phone"
                      name="phone"
                      onChange={this.handleInputChange}/></td>
                        </tr>      
                  </tbody>
                </Table>
          </ModalBody>
          <ModalFooter>
            <Button id="abcAdd" type="submit" color="success" className="success ml-auto"
            style={{background: "darkgreen", color: "white"}}
                onClick={this.toggleModalAdd.bind(this)} onClick={e => this.handleAdd()}>Thêm sinh viên</Button>{' '}
            <Button id="abcAdd" type="Button" className="second" 
            style={{background: "gray", color: "white"}}
            onClick={this.toggleModalAdd.bind(this)}>Huỷ bỏ</Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Danh sách các sinh viên
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên sinh viên</th>
                      <th>Ngày sinh</th>
                      <th>Địa chỉ email</th>
                      <th>Giới tính</th>
                      <th>Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.liststudents.map((item, i) => {
                      return <tr key={i} >
                        <td>{i + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.birthday}</td>
                        <td>{item.email}</td>
                        <td>{item.gender}</td>
                        <td>{item.phone}</td>
                      </tr>

                    })}
                  </tbody>
                </Table>
                <nav>
                  <Row>
                    <Col sm={10}>
                  <Pagination>
                    <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                    <PaginationItem active>
                      <PaginationLink tag="button">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                  </Pagination>
                  </Col>
                  <Col sm={2}>
                  </Col>
                  </Row>
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    );
  }
}

export default Students;