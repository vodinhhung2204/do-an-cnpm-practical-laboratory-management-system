import React, { Component } from 'react';
import {
  Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, TableModal,
  ModalBody, ModalHeader, Form, Button, Modal, Table,
  ModalFooter,
} from 'reactstrap';
import fire from "../../../config/fire";

const firebase = require("firebase");
const storage = firebase.storage();
// Required for side-effects
require("firebase/firestore");
var db = fire.firestore();
class Tables extends Component {
  constructor() {
    super()
    this.state = {
      listCourse: [],
      listSinhvien: [],

      modalisOpen: false
    }
    this.toggleModal = this.toggleModal.bind(this);

  }
  toggleModal() {
    this.setState({
      modalisOpen: !this.state.modalisOpen
    })
  }
  async componentDidMount() {
    var listTmp = [];
    var listTmpStudent = [];
    await db.collection("courses").get().then(async function (querySnapshot) {
      await querySnapshot.forEach(async function (doc) {
        await doc.data().idStudent.forEach(async function (dataStudent) {
          var docRef = await db.collection("students").doc(dataStudent.id);
          await docRef
            .get()
            .then(async function (doc) {
              if (doc.exists) {
                listTmpStudent.push(doc.data())
              }
            })
            .catch(function (error) {
              console.log(error);
            });
          if (localStorage.getItem('DataUser') === dataStudent.id) {
            await doc.data().idDate.forEach(async function (data) {
              var course_tmp = {
                id: doc.data().idCourses,
                name: doc.data().nameCourses,
                day: '',
                period: '',
                room: '',
                giangvien: ''
              }

              var docRef = db.collection("professors").doc(doc.data().idProfessor.id);
              await docRef
                .get()
                .then(async function (doc) {
                  if (doc.exists) {
                    course_tmp.giangvien = doc.data().name;
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
              var docRef2 = db.collection("date").doc(data.id);
              await docRef2
                .get()
                .then(async function (doc) {
                  var docRef3 = db.collection("rooms").doc( doc.data().room.id);
                  await docRef3
                    .get()
                    .then(async function (doc) {
                      if (doc.exists) {
                        console.log(doc)
                        course_tmp.room = doc.data().name;
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                    });

                  if (doc.exists) {
                    course_tmp.day = doc.data().day;
                    course_tmp.period = doc.data().period;
                  }
                  console.log(doc.data().room.id);
                  await listTmp.push(course_tmp)

                })
                .catch(function (error) {
                  console.log(error);
                });

            })
          }
        })
      });
    })
    this.setState({
      listCourse: listTmp,
      listSinhvien: listTmpStudent
    })


  }
  isExist = (arr, x) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === x) return true;
    }
    return false;
  }
  deduplicate = (arr) => {
    let isExist = (arr, x) => arr.includes(x);
    let ans = [];

    arr.forEach(element => {
      if (!isExist(ans, element)) ans.push(element);
    });

    return ans;
  }
  render() {
    var list = this.state.listCourse;
    // var tmp=this.deduplicate(list);
    // list.forEach(ele => {
    //   tmp.forEach(ele_tmp =>{
    //     if(ele.id===ele_tmp.id){
    //       ele.day += ele_tmp.day;
    //       ele.period += ele_tmp.period
    //     }
    //     else tmp.push(ele)
    //   })

    // })
    console.log(list)
    return (
      <div className="animated fadeIn">
        <Modal id="articleModal" isOpen={this.state.modalisOpen}
          toggle={this.toggleModal.bind(this)} className={this.props.className}
        >
          <p></p>
          <h3 className="modal-title" id="myModallabel" style={{ fontSize: 24, fontWeight: "bold", paddingLeft: 16 }}>Danh sách sinh vien</h3>
          <ModalBody>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i> Danh sach scac lop thuc hanh
              </CardHeader>
                  <CardBody>
                    <Table hover bordered striped responsive size="sm">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>MSSV</th>
                          <th>Ten Sinh Vien</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.listSinhvien.map((d, key) => {
                          return (
                            <tr key={key}>
                              <td>{key}</td>
                              <td>{d.mssv}</td>
                              <td>{d.name}</td>
                              <td>{d.email}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Form encType="multipart/form-data" onSubmit={this.handleSubmit} noValidate>
              Click de tat
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button id="abc" type="Button" className="second" onClick={this.toggleModal.bind(this)}>Huỷ bỏ</Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Danh sach cac lop thuc hanh
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Ma hoc phan</th>
                      <th>Ten hoc phan</th>
                      <th>Giang vien</th>
                      <th>Thoi khoa bieu</th>
                      <th>Danh sach</th>
                    </tr>
                  </thead>
                  <tbody>

                    {list.map((d, key) => {
                      return (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{d.id}</td>
                          <td>{d.name}</td>
                          <td>{d.giangvien}</td>
                          <td>{d.day},{d.period},{d.room}</td>
                          <td>
                            <Button sm={5} color="success" onClick={this.toggleModal} style={{ marginLeft: 'auto' }}>Danh sách</Button>
                          </td>
                        </tr>
                      )
                    })}


                  </tbody>
                </Table>
                <nav>
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
                </nav>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    );
  }
}

export default Tables;
