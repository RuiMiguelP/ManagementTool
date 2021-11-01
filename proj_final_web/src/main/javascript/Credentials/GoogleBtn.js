import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import { postData, simpleHeaders } from "../util/Functions";
import { usersAPI } from "../util/APIs";

import { systemStrings } from "../Localization/TranslationLanguages";
import { CLIENT_ID } from "../util/Constants";

class GoogleBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      name: "",
      email: "",
      googleId: "",
      imgUrl: "",
      isLogined: false,
      accessToken: "",
    };
    this.login = this.login.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  login(response) {
    if (response.accessToken) {
      this.setState((state) => ({
        isLogined: true,
        accessToken: response.accessToken,
        name: response.profileObj.name,
        email: response.profileObj.email,
        googleId: response.profileObj.googleId,
        imgUrl: response.profileObj.imageUrl,
      }));
      this.onSubmit();
    }
  }

  onSubmit() {
    var headers = simpleHeaders();
    headers.append("email", this.state.email);
    headers.append("googleId", this.state.googleId);

    postData(
      usersAPI.concat("/google/login"),
      headers,
      this.buildNewUser()
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          localStorage.setItem("email", this.state.email);
          localStorage.setItem("token", data.token);
          localStorage.setItem("uid", data.id);
          localStorage.setItem("name", data.name);
          localStorage.setItem("isAdmin", data.admin);
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("imgUrl", "");
          localStorage.setItem("isDirector", data.director);
          localStorage.setItem("isVisitor", data.visitor);
          localStorage.setItem("isUser", data.user);

          this.setState(
            {
              error: "",
              password: "",
            },
            () => this.props.onLogin(this.state)
          );
        });
      } else {
        this.setState({
          error: systemStrings.somethingWentWrong,
        });
      }
    });
  }

  buildNewUser() {
    return {
      name: this.state.name,
      imgUrl: this.state.imgUrl,
    };
  }

  render() {
    return (
      <React.Fragment>
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText={systemStrings.googleLogin}
          onSuccess={this.login}
          onFailure={this.handleLoginFailure}
          cookiePolicy={"single_host_origin"}
          responseType="code,token"
        />
      </React.Fragment>
    );
  }
}

export default GoogleBtn;
