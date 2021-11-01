"use strict";

import React from "react";
import ReactDOM from "react-dom";

import Register from "./Credentials/Register";
import Login from "./Credentials/Login";
import MainPanel from "./MainArea/MainPanel";
import { postData, requestHeaders } from "./util/Functions";
import { usersAPI } from "./util/APIs";

import { systemStrings } from "./Localization/TranslationLanguages";
import MenuLocalization from "./MainArea/MenuLocalization";

const e = React.createElement;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRegister: false,
      isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")),
      email: localStorage.getItem("email"),
      token: localStorage.getItem("token"),
      uid: localStorage.getItem("uid"),
      name: localStorage.getItem("name"),
      imgUrl: localStorage.getItem("imgUrl"),
      isAdmin: JSON.parse(localStorage.getItem("isAdmin")),
      warningSession: "",
      language: "",
    };
    this.handleShowRegister = this.handleShowRegister.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.messageWarning = this.messageWarning.bind(this);
    this.updateLanguage = this.updateLanguage.bind(this);
  }

  handleLogout() {
    postData(usersAPI.concat("/logout"), requestHeaders(), {}).then(
      (response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            localStorage.setItem("email", null);
            localStorage.setItem("token", null);
            localStorage.setItem("isLoggedIn", false);
            localStorage.setItem("uid", "");
            localStorage.setItem("name", "");
            localStorage.setItem("imgUrl", "");
            localStorage.setItem("isAdmin", false);
            localStorage.setItem("isDirector", false);
            localStorage.setItem("isUser", false);
            localStorage.setItem("isManager", false);
            localStorage.setItem("selectedProject", null);

            this.setState({
              isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")),
            });
          });
        } else if (response.status == 401) {
          this.setState({
            error: systemStrings.noPermission,
          });
        } else {
          this.setState({
            error: systemStrings.somethingWentWrong,
          });
        }
      }
    );
  }

  messageWarning() {
    this.setState({
      warningSession: systemStrings.autoLogoffWarning,
    });
  }

  handleShowRegister() {
    this.setState({ showRegister: !this.state.showRegister });
  }

  handleLogin() {
    this.setState({
      isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")),
      email: localStorage.getItem("email"),
      token: localStorage.getItem("token"),
      uid: localStorage.getItem("uid"),
      name: localStorage.getItem("name"),
      imgUrl: localStorage.getItem("imgUrl"),
      isAdmin: localStorage.getItem("isAdmin"),
    });
  }

  updateLanguage(lang) {
    this.setState({
      language: lang,
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoggedIn ? (
          <MainPanel
            logout={this.handleLogout}
            updateLanguage={this.updateLanguage}
            messageWarning={this.messageWarning}
            onLogin={this.handleLogin}
          />
        ) : (
          <React.Fragment>
            <MenuLocalization updateLanguage={this.updateLanguage} />
            {this.state.showRegister ? (
              <Register
                handleShowRegister={this.handleShowRegister}
                updateLanguage={this.updateLanguage}
              />
            ) : (
              <Login
                handleShowRegister={this.handleShowRegister}
                onLogin={this.handleLogin}
                warningSession={this.state.warningSession}
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
const domContainer = document.querySelector("#app");
ReactDOM.render(e(App), domContainer);
