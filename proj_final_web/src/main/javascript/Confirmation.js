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
} from "semantic-ui-react";

import { key, redirectURL, confirmationURL } from "./util/EmailConfirmation";
import { getParams, putData, simpleHeaders } from "./util/Functions";
import { usersAPI } from "./util/APIs";
import { systemStrings } from "./Localization/TranslationLanguages";

const e = React.createElement;

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: "", success: "", loading: false };
  }

  validateRegister() {
    const jwt = require("jsonwebtoken");
    var url = getParams(window.location);
    var jwtToken = jwt.verify(url.confirmationToken, key);

    var credentials = {
      email: jwtToken.email,
      token: jwtToken.token,
    };
    putData(
      usersAPI.concat("/registerValidation"),
      simpleHeaders(),
      credentials
    ).then((response) => {
      if (response.status == 200) {
        this.setState({
          success: systemStrings.redirectEmailValid,
          loading: true,
        });
        setTimeout(() => this.redirect(), 4000);
      } else {
        this.setState({
          error: systemStrings.sendNewConfirmationEmail,
        });
      }
    });
  }

  resendEmail() {
    this.setState({ loading: true });
    const jwt = require("jsonwebtoken");
    var url = getParams(window.location);
    var jwtToken = jwt.verify(url.confirmationToken, key);

    var body = {
      email: jwtToken.email,
      validationURL: confirmationURL.concat(url.confirmationToken),
    };

    putData(usersAPI.concat("/confirmationMail"), simpleHeaders(), body).then(
      (response) => {
        if (response.status == 200) {
          this.setState({
            loading: false,
            success: systemStrings.emailResent,
          });
        } else {
          this.setState({
            loading: false,
            error: systemStrings.tryAgainLater,
          });
        }
      }
    );
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
              {systemStrings.clickConfirmEmail}
            </Header>
            <Button
              color="teal"
              fluid
              size="large"
              onClick={() => this.validateRegister()}
            >
              {systemStrings.confirm}
            </Button>
            {this.state.error.length > 0 && (
              <Segment>
                <Message error>
                  <h3>{systemStrings.error}</h3>
                  {this.state.error}
                </Message>
                <Button
                  onClick={() => this.resendEmail()}
                  color="yellow"
                  fluid
                  size="medium"
                >
                  {systemStrings.resendConfirmationEmail}
                </Button>
              </Segment>
            )}
            {this.state.success.length > 0 && (
              <Message success>
                <h3>{systemStrings.success}</h3>
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
const domContainer = document.querySelector("#confirmation");
ReactDOM.render(e(Confirmation), domContainer);
