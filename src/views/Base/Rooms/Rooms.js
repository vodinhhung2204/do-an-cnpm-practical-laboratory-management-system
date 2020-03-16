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
class Rooms extends Component {
  constructor() {
    super()
    this.state = {
      listRooms: [],
      modalisOpen: false,
      modalisOpenToEdit: false,
      modalisOpenToAdd: false,
      idRoomCurrent: '',
      idNewRoom: idfinal,
      amount: '',
      broken: '',
      name: '',
      status: '',
      type: '',
      listCurrentRoom: [],
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleModalEdit = this.toggleModalEdit.bind(this);
    this.toggleModalAdd = this.toggleModalAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.GetRoomObject = this.GetRoomObject.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  async componentDidMount() {
    var listTmp = this.state.listRooms.slice();
    await db.collection("rooms").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var room_tmp = {
          id: doc.id,
          name: doc.data().name,
          amount: doc.data().amount,
          broken: doc.data().broken,
          status: doc.data().status,
          type: doc.data().type,
        }
        listTmp.push(room_tmp)
        idfinal = Number(room_tmp.id)+1;
      });
    })
    this.setState({
      listRooms: listTmp
    })
  }
  handleDelete() {
    db.collection("rooms").doc(this.state.idRoomCurrent).delete().then(function () {
      setTimeout(function(){
        document.location.reload();
    }, 1000)
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }
  handleAdd() {
    db.collection("rooms").doc(String(idfinal)).set({
      name: this.state.name,
      amount: this.state.amount,
      broken: this.state.broken,
      type: this.state.type
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
    var updateRoom = db.collection("rooms").doc(this.state.idRoomCurrent);

    // Set the "capital" field of the city 'DC'
    return updateRoom.update({
      "name" : this.state.name,
      "amount": this.state.amount,
      "broken": this.state.broken,
      "type": this.state.type
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
      idRoomCurrent: value
    })
  }
  toggleModalEdit = value => event => {
    this.setState({
      modalisOpenToEdit: !this.state.modalisOpenToEdit,
      idRoomCurrent: value
    })
  }
  toggleModalAdd = event => {
    this.setState({
      modalisOpenToAdd: !this.state.modalisOpenToAdd,
      
    })
  }
  // GetValueAll = item => {
  //   this.setState({
  //    listCurrentRoom : item
  //   })
  //   console.log(this.state.listCurrentRoom)
  // }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  GetRoomObject = (event) => {
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
                    <th>Tên phòng</th>
                      <th>Số lượng</th>
                      <th>Số máy hỏng</th>
                      <th>Loại phòng(0/1)</th>
                    </tr>
                  </thead>
                  <tbody onChange={this.GetRoomObject}>
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
                      labelClassName="Amount"
                      placeholder=""
                      value={this.state.amount}
                      type="text"
                      id="amount"
                      name="amount"
                      onChange={this.handleInputChange}/></td>
                          <td><Input 
                      labelClassName="Broken"
                      placeholder=""
                      value={this.state.broken}
                      type="text"
                      id="broken"
                      name="broken"
                      onChange={this.handleInputChange}/></td>
                      <td><Input 
                      labelClassName="Type"
                      placeholder="0.Thuc Hanh, 1.Tu Hoc"
                      value={this.state.type}
                      type="text"
                      id="type"
                      name="type"
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
                    <th>Tên phòng</th>
                      <th>Số lượng</th>
                      <th>Số máy hỏng</th>
                      <th>Loại phòng(0/1)</th>
                    </tr>
                  </thead>
                  <tbody onChange={this.GetRoomObject}>
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
                      labelClassName="Amount"
                      placeholder=""
                      value={this.state.amount}
                      type="text"
                      id="amount"
                      name="amount"
                      onChange={this.handleInputChange}/></td>
                          <td><Input 
                      labelClassName="Broken"
                      placeholder=""
                      value={this.state.broken}
                      type="text"
                      id="broken"
                      name="broken"
                      onChange={this.handleInputChange}/></td>
                      <td><Input 
                      labelClassName="Type"
                      placeholder="0.Thuc Hanh, 1.Tu Hoc"
                      value={this.state.type}
                      type="text"
                      id="type"
                      name="type"
                      onChange={this.handleInputChange}/></td>
                        </tr>      
                  </tbody>
                </Table>
          </ModalBody>
          <ModalFooter>
            <Button id="abcAdd" type="submit" color="success" className="success ml-auto"
            style={{background: "darkgreen", color: "white"}}
                onClick={this.toggleModalAdd.bind(this)} onClick={e => this.handleAdd()}>Thêm phòng</Button>{' '}
            <Button id="abcAdd" type="Button" className="second" 
            style={{background: "gray", color: "white"}}
            onClick={this.toggleModalAdd.bind(this)}>Huỷ bỏ</Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Danh sách các phòng
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên phòng</th>
                      <th>Số lượng</th>
                      <th>Số máy hỏng</th>
                      <th>Loại phòng</th>
                      <th>hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.listRooms.map((item, i) => {
                      return <tr key={i} >
                        <td>{i + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.amount}</td>
                        <td>{item.broken}</td>
                        <td>{item.type === "0" ? "Thuc hanh" : "Tu hoc"}</td>
                        <td>
                          <Button  
                          onClick={this.toggleModalEdit(item.id)}>
                            <i className="fa fa-edit"></i>
                          </Button>
                          
                        </td>
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

export default Rooms;