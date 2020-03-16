import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader,
  Col, Pagination, PaginationItem, PaginationLink, Row, Table,
  Form,
  FormGroup,
  Label,
  Dropdown,
  DropdownToggle,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
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
      listCouresChange: [],
      valueCourseChange: [],
      dayCurrentCourse: [],
      valueCourseChangeTmp: [],
      idDayFinal: '',
      periodFinal: '',
      dayFinal: ''
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleModalEdit = this.toggleModalEdit.bind(this);
    this.toggleModalAdd = this.toggleModalAdd.bind(this);
    this.GetRoomObject = this.GetRoomObject.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async componentDidMount() {
    //LAY LIST COURSE TRONG KHI EDIT
    var listTmpChange = this.state.listCouresChange.slice();
    var TmpStudent = null;
    var numberstt = 0;
    db.collection("courses").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.data().idDate.forEach(function (data) {
          console.log(data)
          var course_tmp = {
            stt: numberstt,
            id: doc.data().idCourses,
            idDate: data.id,
            name: doc.data().nameCourses,
            day: '',
            period: '',
            room: '',
            nameroom: '',
            giangvien: '',
            students: [],
          }
          doc.data().idStudent.forEach(async function (dataStudent) {
            var docRef = db.collection("students").doc(dataStudent.id);
            docRef
              .get()
              .then(async function (doc) {
                if (doc.exists) {
                  TmpStudent = {
                    mssv: doc.data().mssv,
                    name: doc.data().name,
                    email: doc.data().email,
                    phone: doc.data().phone
                  }
                  //
                  course_tmp.students.push(TmpStudent)
                  TmpStudent = null;
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          var docRefgv = db.collection("professors").doc(doc.data().idProfessor.id);
          docRefgv
            .get()
            .then(function (doc) {
              if (doc.exists) {
                course_tmp.giangvien = doc.data().name;
              }
            })
          var docRef = db.collection("date").doc(data.id);
          docRef
            .get()
            .then(function (doc) {
              if (doc.exists) {
                course_tmp.day = doc.data().day;
                course_tmp.period = doc.data().period;
                course_tmp.room = doc.data().room.id;
              }
              //console.log(course_tmp.id)
              var docRefroom = db.collection("rooms").doc(course_tmp.room);
              docRefroom
                .get()
                .then(function (doc) {
                  if (doc.exists) {

                    course_tmp.nameroom = doc.data().name;
                  }
                  //console.log(course_tmp.id)
                  listTmpChange.push(course_tmp)
                }
                )
            }
            )
            .catch(function (error) {
              console.log(error);
            });
        })
      });
    })
    this.setState({
      valueCourseChange: listTmpChange,
    })


    //////////////////////////
    var listTmp = this.state.listRooms.slice();
    await db.collection("rooms").get().then(async function (querySnapshot) {
      querySnapshot.forEach(async function (doc) {
        var room_tmp = {
          id: doc.id,
          name: doc.data().name,
          amount: doc.data().amount,
          broken: doc.data().broken,
          status: doc.data().status,
          type: doc.data().type,
          period: [],
          day: '',
          vacant: [
            '1,2,3,4,5,6,7,8,9,10', // thu 2
            '1,2,3,4,5,6,7,8,9,10', // thu 3
            '1,2,3,4,5,6,7,8,9,10', // thu 4
            '1,2,3,4,5,6,7,8,9,10', //thu 5
            '1,2,3,4,5,6,7,8,9,10', // thu 6
            '1,2,3,4,5,6,7,8,9,10', // thu7
          ]
        }
        if (doc.data().type === "1") {
          listTmp.push(room_tmp)
          idfinal = Number(room_tmp.id) + 1;
        }
      });
    })

    await db.collection("date").get().then(async function (querySnapshot) {
      await querySnapshot.forEach(async function (doc) {
        listTmp.forEach(function (data) {
          if (data.id === doc.data().idRoom) {
            var dau = doc.data().period.slice(0, 1) // vi tri dau cua thu
            var cuoi = doc.data().period.slice(2, 4) // vi tri cuoi cua thu
            //console.log("hom nay la  " + thu + "dau la " + dau + " cuoi " + cuoi + " lich nay cua phong " + data.name)
            data.vacant[doc.data().day - 2].split(",")
            //console.log(data.vacant[doc.data().day - 2])
            var periodcurrent = data.vacant[doc.data().day - 2];
            periodcurrent = periodcurrent.split(",")
            for (var i = 0; i < 10; i++) {
              if (periodcurrent[i] === dau) {
                periodcurrent[i] = "n";
                for (var k = i + 1; k < 10; k++) {
                  if (periodcurrent[k] !== cuoi) {
                    periodcurrent[k] = "n"
                  }
                  if (periodcurrent[k] === cuoi) {
                    periodcurrent[k] = "n";
                    break
                  }
                }
              }
            }
            var tmp = periodcurrent.join()
            //console.log(tmp)
            data.vacant[doc.data().day - 2] = tmp
            //console.log(periodcurrent)
          }
        })
      });
    })
    //console.log("day la list room", listTmp)
    //Lay list course de edit
    var msgv = localStorage.getItem("DataUser")
    var listCouresChangeTmp = []
    await db.collection("courses").get().then(async function (querySnapshot) {
      await querySnapshot.forEach(async function (doc) {
        console.log(doc.data())
        if (doc.data().msgv === msgv) {
          listCouresChangeTmp.push(doc.data())
        }
      })
    })

    console.log(listCouresChangeTmp)
    this.setState({
      listRooms: listTmp,
      listCouresChange: listCouresChangeTmp
    })
  }

  ChangeCourseAction = (obj) => {
    console.log(obj.target.value)
    console.log(this.state.valueCourseChange)
    var ListCourseChange = this.state.valueCourseChange;
    //this.state.valueCourseChange
    var inforCourseChange = []
    ListCourseChange.forEach(function (Data) {
      console.log(Data)
      if (Data.id === obj.target.value) {
        var TmpChange = {
          room: '',
          day: '',
          period: '',
          idDate: Data.idDate
        }
        TmpChange.room = Data.nameroom;
        TmpChange.day = Data.day;
        TmpChange.period = Data.period
        inforCourseChange.push(TmpChange)
      }
    })
    this.setState({
      valueCourseChangeTmp: inforCourseChange
    })
  }
  ChangeCourseActionDetail = (obj) => {
    this.setState({
      idDayFinal: obj.target.value
    })
  }
  ChangeCourseActionDayFinal = (obj) => {
    this.setState({
      dayFinal: obj.target.value
    })
  }
  
  handleEdit = (e) => {
    this.setState({
      modalisOpenToEdit: !this.state.modalisOpenToEdit,
      idRoomCurrent: e
    })
    console.log(e)
    var idroom = this.state.idRoomCurrent
    var tmp = {
      day: this.state.dayFinal,
      idRoom: db.doc(`/roomBooked/${idroom}`),
      period: this.state.periodFinal,
      mssv: localStorage.getItem('DataUser')
    }
    console.log(tmp)
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
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    console.log(value)
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
              style={{ background: "darkgreen", color: "white" }}
              onClick={this.toggleModal("0").bind(this)} onClick={e => this.handleDelete()}>Xác nhận</Button>{' '}
            <Button id="abc" type="Button" className="second"
              style={{ background: "gray", color: "white" }}
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
                  <th>Chọn thứ</th>
                  <th>Chọn tiết (*-*)</th>
                </tr>
              </thead>
              <tbody onChange={this.GetRoomObject}>
                <tr>
                  <td>
                    <select onChange={this.ChangeCourseActionDayFinal} >
                      <option key={0} value="Select">Select</option>
                      <option key={1} value="2">Thứ 2</option>
                      <option key={2} value="3">Thứ 3</option>
                      <option key={3} value="4">Thứ 4</option>
                      <option key={4} value="5">Thứ 5</option>
                      <option key={5} value="6">Thứ 6</option>
                      <option key={6} value="7">Thứ 7</option>
                    </select>
                  </td>
                  <td>
                    <Input className="login-input-text"
                      placeholder="vd: 6-8 , 5-10"
                      labelClassName="Password"
                      value={this.state.password}
                      type="text"
                      id="periodChange"
                      name="periodFinal"
                      onChange={this.handleInputChange}
                    ><i class="fa fa-lock" aria-hidden="true"></i></Input>
                  </td>
                </tr>
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button id="abcEdit" type="submit" className="success ml-auto"
              style={{ background: "darkgreen", color: "white" }}
              onClick={e => this.handleEdit()}>Lưu thay đổi</Button>{' '}
            <Button id="abcEdit" className="second"
              style={{ background: "gray", color: "white" }}
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
                    onChange={this.handleInputChange} /></td>
                  <td><Input
                    labelClassName="Broken"
                    placeholder=""
                    value={this.state.broken}
                    type="text"
                    id="broken"
                    name="broken"
                    onChange={this.handleInputChange} /></td>
                  <td><Input
                    labelClassName="Type"
                    placeholder="0.Thuc Hanh, 1.Tu Hoc"
                    value={this.state.type}
                    type="text"
                    id="type"
                    name="type"
                    onChange={this.handleInputChange} /></td>
                </tr>
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button id="abcAdd" type="submit" color="success" className="success ml-auto"
              style={{ background: "darkgreen", color: "white" }}
              onClick={this.toggleModalAdd.bind(this)} onClick={e => this.handleAdd()}>Thêm phòng</Button>{' '}
            <Button id="abcAdd" type="Button" className="second"
              style={{ background: "gray", color: "white" }}
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
                      <th>Tiết (n: số tiết đã được đặt)</th>
                      <th>Số  Lượng Máy</th>
                      <th>Loại phòng</th>
                      <th>Đặt Phòng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.listRooms.map((item, i) => {
                      if (item.type === "1") {
                        return <tr key={i.id} >
                          <td>{i + 1}</td>
                          <td>{item.name}</td>
                          <td>
                            {item.vacant.map((data, index) => {
                              return (
                                <p key={index}>Thứ {index + 2} : {data}</p>
                              )
                            })}
                          </td>
                          <td>{item.amount}</td>
                          <td>{item.type === "0" ? "Thuc hanh" : "Tu hoc"}</td>
                          <td>
                            <Button
                              onClick={()=>this.handleEdit(item.id)}>
                              <i className="fa fa-edit" ></i>
                            </Button>

                          </td>
                        </tr>
                      }


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