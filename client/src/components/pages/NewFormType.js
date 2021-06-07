import "bootstrap/dist/css/bootstrap.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import swal from 'sweetalert'
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBDropdownMenu
} from "mdbreact";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import trans from "../translations/spcTranslation";
//import {Dropdown} from 'react-bootstrap';
import { Dropdown } from "semantic-ui-react";
import DropdownItem from "react-bootstrap/DropdownItem";
import Footer from "../layout/footer";
import { Button } from "react-bootstrap";
import { conditionalExpression } from "@babel/types";

var mongoose = require("mongoose");

class NewFormType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      atts: false,
      attributeName: "",
      formType: "",
      type: "",
      required: "not required",
      unique: "not unique",
      min: "",
      max: "",
      frontend: "",
      array: "",
      payload: {}
    };
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClick1 = error => {
    error.preventDefault();
    if (this.state.formType !== "") {
      var payload = this.state.payload;
      payload.formType = this.state.formType;
      this.setState({ atts: true, payload: payload });
    } else {
      swal("Please provide a Form Type Name");
        }
  };

  handleClick2 = error => {
    error.preventDefault();
    if (this.state.attributeName === "")
      swal("Please Provide an Attribute Name");
    if (
      this.state.type === "" ||
      this.state.type === "Please Provide an Input Type"
    ) {
      swal("Please provide a valid input type");
      return;
    }

    var constraints = "";

    constraints = constraints + this.state.type + ",";
    constraints = constraints + this.state.required + ",";

    if (this.state.type === "array") {
      constraints = constraints + this.state.array + ",,,,";
    } else {
      if (this.state.type === "string" || this.state.type === "number") {
        if (this.state.min !== "")
          if (!parseInt(this.state.min)) {
            swal("Please provide a number in the minimum field");
            return;
          }
        constraints = constraints + this.state.min + ",";
        if (this.state.max !== "")
          if (!parseInt(this.state.max)) {
            swal("Please provide a number in the maximum field");
            return;
            
          }
        constraints = constraints + this.state.min + ",";
      } else constraints = constraints + ",,";
      constraints = constraints + this.state.unique + ",";
      if (this.state.type === "date") constraints = constraints + "datepicker";
      else constraints = constraints + this.state.frontend;
    }
    var payload = this.state.payload;
    payload[this.state.attributeName] = constraints;
    this.setState({ payload: payload });
    // swal({
    //   title: "Good job!",
    //   text: "Attribute Added successfully!",
    //   icon: "success",
    //   button: "Aww yess!",
    //   });
   swal("Attribute Added Successfully");
  };

  handleClick3 = () => {
    this.setState({
      attributeName: "",
      formType: "",
      type: "",
      required: "not required",
      unique: "not unique",
      min: "",
      max: "",
      frontend: "",
      array: ""
    });
  };

  handleClick4 = () => {
    var payload = this.state.payload;
    axios
      .post("/routes/api/formTypes/NewFormType", payload, {
        headers: { Authorization: localStorage.getItem("jwtToken") }
      })
      .then(res => {
        swal({
					title: "Good job!",
					text: "Form Type created successfully!",
					icon: "success",
					button: "Aww yess!",
				  });
        //swal("Form Type created successfully");
        setTimeout("document.location.href = '/createNewFormType';",3500)
      })
      .catch(err => {
        swal(err);
      });
  };

  getAtts = () => {
    var payload = this.state.payload;
    var props = [];
    for (var prop in payload) {
      if (prop !== "formType") props.push(prop);
    }
    return props.map(att => {
      return <h6>{att}</h6>;
    });
  };

  render = () => {
    var start = (
      <div style={{ paddingLeft: "60px", justifyItems: "center" }}>
        <br />
        <br />
        <br />
        <br />
        <MuiThemeProvider>
          <div style={{ marginBottom: "60px" }}>
            <MDBRow style={{  justifyItems: "center" }}>
              <MDBCol>
                <MDBInput
                  label="Form Type"
                  value={this.state.formType}
                  name="formType"
                  onChange={this.changeHandler}
                  type="text"
                  id="materialFormRegisterNameEx"
                  required
                  style = {{width:"700px"}}
                />
              </MDBCol>
            </MDBRow>
            <Button
              className="text-center mb-3"
              variant="omar"
              label="Add Attributes"
              primary={true}
              onClick={this.handleClick1}
              style={{ width: '160px', height: '55px',backgroundColor:"#a3dbf1" }}
            >
            Add Attributes
            </Button>
          </div>
        </MuiThemeProvider>
      </div>
    );
    var array = (
      <MDBRow style={{ paddingLeft: "30px", justifyItems: "center" }}>
        <MDBCol>
          <MDBInput
            label="Form Type Array"
            value={this.state.array}
            name="array"
            onChange={this.changeHandler}
            type="text"
            id="materialFormRegisterNameEx"
            required
          />
        </MDBCol>
      </MDBRow>
    );
    var min = (
      <div style={{ marginBottom: "60px" }}>
        <MDBRow style={{ paddingLeft: "30px", justifyItems: "center" }}>
          <MDBCol>
            <MDBInput
              label="Minimum Length or Value"
              value={this.state.min}
              name="min"
              onChange={this.changeHandler}
              type="text"
              id="materialFormRegisterNameEx"
              required
            />
          </MDBCol>
        </MDBRow>
      </div>
    );

    var max = (
      <div style={{ marginBottom: "60px" }}>
        <MDBRow style={{ paddingLeft: "30px", justifyItems: "center" }}>
          <MDBCol>
            <MDBInput
              label="Maximum Length or Value"
              value={this.state.max}
              name="max"
              onChange={this.changeHandler}
              type="text"
              id="materialFormRegisterNameEx"
              required
            />
          </MDBCol>
        </MDBRow>
      </div>
    );
    var notdate = (
      <MDBCol>
        <div className="form-group">
          <label htmlFor="Type of Input"><h4>Type of Front End Input</h4></label>
          <select
            className="form-control"
            id="exampleFormControlSelect1"
            name="frontend"
            onChange={this.changeHandler}
            value={this.state.frontend}
            style={{ width: "300px" }}
          >
            <option>Please Provide a Front End Type</option>
            <option>textbox</option>
            <option>dropdownlist</option>
          </select>
        </div>
      </MDBCol>
    );

    var attributes = (
      <div style={{ paddingLeft: "60px", justifyItems: "center" }}>
        <br />
        <br />
        <br />
        <br />
        <h1>{this.state.formType}</h1>
        <h3>Avaliable Attributes till now</h3>
        {this.getAtts()}
        <MuiThemeProvider>
          <MDBRow style={{ paddingLeft: "30px", justifyItems: "center" }}>
            <MDBCol>
              <MDBInput
                label="Attribute Name"
                value={this.state.attributeName}
                name="attributeName"
                onChange={this.changeHandler}
                type="text"
                id="materialFormRegisterNameEx"
                required
              />
            </MDBCol>
          </MDBRow>

          <MDBCol>
            <div className="form-group">
              <label htmlFor="Type of Input"><h4>Type of Input</h4></label>
              <select
                className="form-control"
                id="exampleFormControlSelect1"
                name="type"
                onChange={this.changeHandler}
                value={this.state.type}
                style={{ width: "300px" }}
              >
                <option><h4>Please Provide an Input Type</h4></option>
                <option>string</option>
                <option>number</option>
                <option>date</option>
                <option>array</option>
                <option>object</option>
                <option>objectId</option>
              </select>
            </div>
          </MDBCol>
          <h6 style={{ fontSize: "15px" }}>
            If you choose an array Please provide an Array Name below and go to
            new Form Type Array Creation
          </h6>

          <MDBCol>
            <div className="form-group">
              <label htmlFor="Type of Input"><h4>Required</h4></label>
              <select
                className="form-control"
                id="exampleFormControlSelect1"
                name="required"
                onChange={this.changeHandler}
                value={this.state.required}
                style={{ width: "300px" }}
              >
                <option>not required</option>
                <option>required</option>
              </select>
            </div>
          </MDBCol>

          {this.state.type === "string" ? min : null}
          {this.state.type === "string" ? max : null}
          {this.state.type === "number" ? min : null}
          {this.state.type === "number" ? max : null}

          <MDBCol>
            <div className="form-group">
              <label htmlFor="Type of Input"><h4>Unique</h4></label>
              <select
                className="form-control"
                id="exampleFormControlSelect1"
                name="unique"
                onChange={this.changeHandler}
                value={this.state.unique}
                style={{ width: "300px" }}
              >
                <option>not unique</option>
                <option>unique</option>
              </select>
            </div>
          </MDBCol>

          {this.state.type === "date" ? null : notdate}
          {this.state.type === "array" ? array : null}
          <Button
            className="text-center mb-3"
            label="Save Attribute"
            primary={true}
            onClick={this.handleClick2}
            style={{ width: '120px', height: '55px',backgroundColor:"#a3dbf1" }}
            variant="omar"
          >
          Save Attribute
          </Button>
          <Button
            label="Next Attribute"
            primary={true}
            onClick={this.handleClick3}
            className="text-center mb-3"
            style={{ width: '120px', height: '55px',backgroundColor:"#a3dbf1" }}
            variant="omar"
          >
          Next Attribute
          </Button>
          <Button
            className="text-center mb-3"
            label="Submit Form Type"
            primary={true}
            onClick={this.handleClick4}
            style={{ width: '120px', height: '55px',backgroundColor:"#a3dbf1" }}
            variant="omar"
          >
          Submit Form Type 
          </Button>
        </MuiThemeProvider>
      </div>
    );
    return this.state.atts ? attributes : start;
  };
}

export default NewFormType;
