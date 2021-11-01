"use strict";
import React from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Grid,
  Header,
  Message,
  Segment,
  Loader,
  Form,
} from "semantic-ui-react";
import { key, redirectURL } from "./util/EmailConfirmation";
import { getParams, putData, simpleHeaders } from "./util/Functions";
import { usersAPI } from "./util/APIs";
import { systemStrings } from "./Localization/TranslationLanguages";

const e = React.createElement;

class Reset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      success: "",
      loading: false,
      password: "",
      confirmPassword: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitNewPassword = this.submitNewPassword.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  isFormValid() {
    if (this.state.password.length < 6) {
      this.setState({
        error: systemStrings.password6Char,
        loading: false,
      });
      return false;
    }
    if (this.state.password != this.state.confirmPassword) {
      this.setState({
        error: systemStrings.passwordsDontMatch,
        loading: false,
      });
      return false;
    }
    if (this.isFormEmpty(this.state)) {
      this.setState({
        error: systemStrings.fillAllFields,
        loading: false,
      });
      return false;
    } else {
      return true;
    }
  }

  isFormEmpty({ password, confirmPassword }) {
    return !password.length || !confirmPassword.length;
  }

  submitNewPassword() {
    const jwt = require("jsonwebtoken");
    var url = getParams(window.location);
    var jwtToken = jwt.verify(url.resetToken, key);
    var credentials = {
      email: jwtToken.email,
      token: jwtToken.token,
      password: this.state.password,
    };
    if (this.isFormValid()) {
      putData(
        usersAPI.concat("/resetPassword"),
        simpleHeaders(),
        credentials
      ).then((response) => {
        if (response.status == 200) {
          this.setState({
            success: systemStrings.redirect,
            loading: true,
          });
          setTimeout(() => this.redirect(), 4000);
        } else {
          this.setState({
            error: systemStrings.sendNewPass,
          });
        }
      });
    }
  }

  redirect() {
    window.location.href = redirectURL;
  }

  render() {
    return (
      <React.Fragment>
        <Grid textAlign="center" verticalAlign="middle" className="indexGrid">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              {systemStrings.changePassword}
            </Header>
            <Form size="large" onSubmit={this.submitNewPassword}>
              <Segment stacked>
                <Form.Input
                  fluid
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder={systemStrings.password}
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  name="confirmPassword"
                  icon="lock"
                  iconPosition="left"
                  placeholder={systemStrings.confirmPassword}
                  type="password"
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                />
                <Button color="teal" fluid size="large">
                  {systemStrings.confirm}
                </Button>
              </Segment>
            </Form>
            {this.state.error.length > 0 && (
              <Segment>
                <Message error>
                  <h3> {systemStrings.error}</h3>
                  {this.state.error}
                </Message>
              </Segment>
            )}
            {this.state.success.length > 0 && (
              <Message success>
                <h3> {systemStrings.success}</h3>
                {this.state.success}
              </Message>
            )}
            <Loader
              active={this.state.loading}
              inline="centered"
              size="medium"
            />
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}
const domContainer = document.querySelector("#reset");
ReactDOM.render(e(Reset), domContainer);
