import React, { Component } from "react";
import { FormGroup, Label, Input, Col, Row, Container } from "reactstrap";
//import "./LabelInput.css";
import "bootstrap/dist/css/bootstrap.min.css";

class LabelInput extends Component {
  render() {
    const {
      id,
      type,
      name,
      className,
      value,
      label,
      labelClassName,
      onChange,
      placeholder
    } = this.props;
    return (
      <FormGroup className={className}>
        <Row>
          <Col xs={2}>
            <Label className={labelClassName}>{label}</Label>
          </Col>
          <Col xs={8}>
            <Input
              placeholder={placeholder}
              type={type}
              name={name}
              value={value}
              className={className}
              id={id}
              onChange={onChange}
            />
          </Col>
        </Row>
      </FormGroup>
    );
  }
}

export default LabelInput;
