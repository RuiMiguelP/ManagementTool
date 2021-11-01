import React, { Component } from "react";

import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Icon,
} from "semantic-ui-react";
import GoogleBtn from "./GoogleBtn";
import { putData, postData, simpleHeaders } from "../util/Functions";
import { key, randomToken, resetPasswordURL } from "../util/EmailConfirmation";
import { usersAPI } from "../util/APIs";

import { systemStrings } from "../Localization/TranslationLanguages";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      email: "",
      name: "",
      password: "",
      token: "",
      isAdmin: "",
      error: "",
      resetPassword: false,
      messageSuccess: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.isFormEmpty = this.isFormEmpty.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.onResetPassword = this.onResetPassword.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.goBackLogin = this.goBackLogin.bind(this);
  }

  isFormValid() {
    if (this.isFormEmpty(this.state)) {
      this.setState({
        error: systemStrings.fillAllFields,
        messageSuccess: "",
      });
      return false;
    } else {
      return true;
    }
  }

  isFormEmpty({ email, password }) {
    return !email.length || !password.length;
  }

  isEmailValid() {
    if (this.isEmailEmpty(this.state)) {
      this.setState({
        error: systemStrings.fillEmailField,
      });
      return false;
    } else {
      return true;
    }
  }

  isEmailEmpty({ email }) {
    return !email.length;
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleResetPassword() {
    this.setState({ resetPassword: true });
  }

  onResetPassword(e) {
    e.preventDefault();
    if (this.isEmailValid()) {
      putData(
        usersAPI.concat("/sendResetPasswordEmail"),
        simpleHeaders(),
        this.buildResetInfo()
      ).then((response) => {
        if (response.status == 200) {
          this.setState({
            uid: "",
            email: "",
            name: "",
            password: "",
            token: "",
            isAdmin: "",
            error: "",
            resetPassword: false,
            messageSuccess: systemStrings.checkEmail,
          });
        } else {
          this.setState({
            error: systemStrings.somethingWentWrong,
            messageSuccess: "",
          });
        }
      });
    }
  }

  buildResetInfo() {
    const jwt = require("jsonwebtoken");
    var token = randomToken;
    let validationToken = jwt.sign(
      {
        email: this.state.email,
        token: token,
      },
      key
    );

    return {
      email: this.state.email,
      token: randomToken,
      validationURL: resetPasswordURL.concat(validationToken),
    };
  }

  goBackLogin() {
    this.setState({ resetPassword: false, error: "" });
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.isFormValid()) {
      var headers = simpleHeaders();
      headers.append("email", this.state.email);
      headers.append("password", this.state.password);

      postData(usersAPI.concat("/login"), headers, {}).then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            localStorage.setItem("email", this.state.email);
            localStorage.setItem("token", data.token);
            localStorage.setItem("uid", data.id);
            localStorage.setItem("name", data.name);
            localStorage.setItem("isAdmin", data.admin);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("isDirector", data.director);
            localStorage.setItem("isVisitor", data.visitor);
            localStorage.setItem("isUser", data.user);

            if (data.file) {
              var dataImage = data.file;
              localStorage.setItem(
                "imgUrl",
                "data:image/png;base64," + dataImage
              );
            } else {
              localStorage.setItem("imgUrl", "");
            }
            this.setState(
              {
                error: "",
                password: "",
              },
              () => this.props.onLogin(this.state)
            );
          });
        } else if (response.status == 401) {
          this.setState({
            email: "",
            password: "",
            error: systemStrings.loginFailed,
          });
        } else if (response.status == 403) {
          this.setState({
            email: "",
            password: "",
            error: systemStrings.accountNotActive,
          });
        } else {
          this.setState({
            error: systemStrings.somethingWentWrong,
          });
        }
      });
    }
  }

  render() {
    const {
      resetPassword,
      email,
      error,
      password,
      messageSuccess,
    } = this.state;
    const { onLogin, warningSession } = this.props;
    return (
      <React.Fragment>
        <Grid textAlign="center" verticalAlign="middle" className="indexGrid">
          <Grid.Column style={{ maxWidth: 450 }}>
            {resetPassword ? (
              <React.Fragment>
                <Header as="h2" color="teal" textAlign="center">
                  {systemStrings.resetPassword}
                  <Icon name="sign-in" color="teal" />
                </Header>
                <Form size="large" onSubmit={this.onResetPassword}>
                  <Segment stacked>
                    <Form.Input
                      fluid
                      name="email"
                      icon="mail"
                      iconPosition="left"
                      placeholder={systemStrings.emailAddress}
                      type="email"
                      value={email}
                      onChange={this.handleChange}
                    />
                    <Button color="teal" fluid size="large">
                      {systemStrings.resetPassword}
                    </Button>
                  </Segment>
                </Form>
                <Message>
                  <a href="#" onClick={() => this.goBackLogin()}>
                    {systemStrings.goBack}
                  </a>
                </Message>
                {error.length > 0 && (
                  <Message error>
                    <h3> {systemStrings.error}</h3>
                    {error}
                  </Message>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Header as="h2" color="teal" textAlign="center">
                  {systemStrings.login} <Icon name="sign-in" color="teal" />
                </Header>
                <Form size="large" onSubmit={this.onSubmit}>
                  <Segment stacked>
                    <Form.Input
                      fluid
                      name="email"
                      icon="mail"
                      iconPosition="left"
                      placeholder={systemStrings.emailAddress}
                      type="email"
                      value={email}
                      onChange={this.handleChange}
                    />
                    <Form.Input
                      fluid
                      name="password"
                      icon="lock"
                      iconPosition="left"
                      placeholder={systemStrings.password}
                      type="password"
                      value={password}
                      onChange={this.handleChange}
                    />
                    <Button color="teal" fluid size="large">
                      {systemStrings.login}
                    </Button>
                  </Segment>
                </Form>
                <GoogleBtn onLogin={onLogin} />
                <Message>
                  {systemStrings.newToUs + " "}
                  <a href="#" onClick={() => this.props.handleShowRegister()}>
                    {systemStrings.signUp}
                  </a>
                </Message>
                <Message>
                  {systemStrings.forgotPassword + " "}
                  <a href="#" onClick={() => this.handleResetPassword()}>
                    {systemStrings.createNewOne}
                  </a>
                </Message>
                {messageSuccess.length > 0 && (
                  <Message success>
                    <h3> {systemStrings.success}</h3>
                    {messageSuccess}
                  </Message>
                )}
                {error.length > 0 && (
                  <Message error>
                    <h3>{systemStrings.error}</h3>
                    {error}
                  </Message>
                )}
                {warningSession.length > 0 && (
                  <Message warning>{warningSession}</Message>
                )}
              </React.Fragment>
            )}
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Login;
