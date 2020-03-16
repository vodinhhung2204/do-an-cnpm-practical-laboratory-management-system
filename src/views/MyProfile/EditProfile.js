import React, { Component } from "react";
// @material-ui/core components
// core components
import GridItem from "../Grid/GridItem.js";
import GridContainer from "../Grid/GridContainer.js";
import LabelInput from "../LabelInput/LabelInput";
import "bootstrap/dist/css/bootstrap.min.css";
//import avatar from "assets/img/faces/marc.jpg";
import { Col, Row, Card, CardBody,CardHeader,Button , CardFooter} from "reactstrap";

export default class EditProfile extends Component {
  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      email: "",
      password: "",
      phone: "",
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
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={this.state.classes.cardTitleWhite}>
                    Edit Profile
                </h4>
                <p className={this.state.classes.cardCategoryWhite}>
                  Complete your profile
                </p>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <GridContainer>
                      <LabelInput
                        labelClassName="MSSV"
                        label="MSSV"
                        placeholder="MSSV"
                        value={this.state.username}
                        type="text"
                        id="mssv"
                        name="mssv"
                        onChange={this.handleInputChange}
                      ></LabelInput>
                    </GridContainer>
                  </Col>
                  <Col>
                    <GridContainer>
                      <LabelInput
                        labelClassName="Phone"
                        label="Phone"
                        placeholder="Phone"
                        value={this.state.username}
                        type="text"
                        id="phone"
                        name="phone"
                        onChange={this.handleInputChange}
                      ></LabelInput>
                    </GridContainer>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <GridContainer>
                      <LabelInput
                        labelClassName="Name"
                        label="Name"
                        placeholder="Name"
                        value={this.state.username}
                        type="text"
                        id="name"
                        name="name"
                        onChange={this.handleInputChange}
                      ></LabelInput>
                    </GridContainer>
                  </Col>
                  <Col></Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Button color="primary">Save</Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardBody profile>
                <h6 className={this.state.classes.cardCategory}>
                  CEO / CO-FOUNDER
                </h6>
                <h4 className={this.state.classes.cardTitle}>HUNG</h4>
                <p className={this.state.classes.description}>
                  Don{"'"}t be cccc abc 123 State
                </p>
                <Button color="primary" round>
                  Follow
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
