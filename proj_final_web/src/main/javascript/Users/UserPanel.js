import React from "react";
import { Grid, Header, Dropdown, Image } from "semantic-ui-react";
import { systemStrings } from "../Localization/TranslationLanguages";

class UserPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: JSON.parse(localStorage.getItem("isAdmin")),
      isDirector: JSON.parse(localStorage.getItem("isDirector")),
      userName: localStorage.getItem("name"),
      imgUrl: localStorage.getItem("imgUrl"),
      isVisitor: JSON.parse(localStorage.getItem("isVisitor")),
    };
  }

  dropdownOptions(
    isDirector,
    isVisitor,
    isAdmin,
    wantsToGoAdminArea,
    wantsToGoDashboard
  ) {
    if (isAdmin) {
      if (isDirector) {
        if (wantsToGoAdminArea) {
          return [
            {
              key: "user",
              text: (
                <span>
                  {systemStrings.signInAs}{" "}
                  <strong>{this.state.userName}</strong>
                </span>
              ),
              disabled: true,
            },
            {
              key: "mainPanel",
              text: (
                <span onClick={this.props.goToMainPanel}>
                  {systemStrings.goMainPanel}
                </span>
              ),
            },
            {
              key: "dashboard",
              text: (
                <span onClick={this.props.goToDashboard}>
                  {systemStrings.goDashboard}
                </span>
              ),
            },
            {
              key: "signout",
              text: (
                <span onClick={this.props.logout}>
                  {systemStrings.signedOut}
                </span>
              ),
            },
          ];
        } else if (wantsToGoDashboard) {
          return [
            {
              key: "user",
              text: (
                <span>
                  {systemStrings.signInAs}{" "}
                  <strong>{this.state.userName}</strong>
                </span>
              ),
              disabled: true,
            },
            {
              key: "mainPanel",
              text: (
                <span onClick={this.props.goToMainPanel}>
                  {systemStrings.goMainPanel}
                </span>
              ),
            },
            {
              key: "adminArea",
              text: (
                <span onClick={this.props.goToAdminArea}>
                  {systemStrings.goAdminArea}
                </span>
              ),
            },
            {
              key: "signout",
              text: (
                <span onClick={this.props.logout}>
                  {systemStrings.signedOut}
                </span>
              ),
            },
          ];
        } else {
          return [
            {
              key: "user",
              text: (
                <span>
                  {systemStrings.signInAs}
                  <strong>{this.state.userName}</strong>
                </span>
              ),
              disabled: true,
            },
            {
              key: "adminArea",
              text: (
                <span onClick={this.props.goToAdminArea}>
                  {systemStrings.goAdminArea}
                </span>
              ),
            },
            {
              key: "dashboard",
              text: (
                <span onClick={this.props.goToDashboard}>
                  {systemStrings.goDashboard}
                </span>
              ),
            },
            {
              key: "signout",
              text: (
                <span onClick={this.props.logout}>
                  {systemStrings.signedOut}
                </span>
              ),
            },
          ];
        }
      } else {
        if (wantsToGoAdminArea) {
          return [
            {
              key: "user",
              text: (
                <span>
                  {systemStrings.signInAs}{" "}
                  <strong>{this.state.userName}</strong>
                </span>
              ),
              disabled: true,
            },
            {
              key: "mainPanel",
              text: (
                <span onClick={this.props.goToMainPanel}>
                  {systemStrings.goMainPanel}
                </span>
              ),
            },
            {
              key: "signout",
              text: (
                <span onClick={this.props.logout}>
                  {systemStrings.signedOut}
                </span>
              ),
            },
          ];
        } else {
          return [
            {
              key: "user",
              text: (
                <span>
                  {systemStrings.signInAs}
                  <strong>{this.state.userName}</strong>
                </span>
              ),
              disabled: true,
            },
            {
              key: "adminArea",
              text: (
                <span onClick={this.props.goToAdminArea}>
                  {systemStrings.goAdminArea}
                </span>
              ),
            },
            {
              key: "signout",
              text: (
                <span onClick={this.props.logout}>
                  {systemStrings.signedOut}
                </span>
              ),
            },
          ];
        }
      }
    } else if (isVisitor) {
      return [
        {
          key: "user",
          text: (
            <span>
              {systemStrings.signInAs} <strong>{this.state.userName}</strong>
            </span>
          ),
          disabled: true,
        },
        {
          key: "signout",
          text: (
            <span onClick={this.props.logout}>{systemStrings.signedOut}</span>
          ),
        },
      ];
    } else {
      if (wantsToGoDashboard) {
        return [
          {
            key: "user",
            text: (
              <span>
                {systemStrings.signInAs} <strong>{this.state.userName}</strong>
              </span>
            ),
            disabled: true,
          },
          {
            key: "mainPanel",
            text: (
              <span onClick={this.props.goToMainPanel}>
                {systemStrings.goMainPanel}
              </span>
            ),
          },
          {
            key: "signout",
            text: (
              <span onClick={this.props.logout}>{systemStrings.signedOut}</span>
            ),
          },
        ];
      } else {
        return [
          {
            key: "user",
            text: (
              <span>
                {systemStrings.signInAs} <strong>{this.state.userName}</strong>
              </span>
            ),
            disabled: true,
          },
          {
            key: "dashboard",
            text: (
              <span onClick={this.props.goToDashboard}>
                {systemStrings.goDashboard}
              </span>
            ),
          },
          {
            key: "signout",
            text: (
              <span onClick={this.props.logout}>{systemStrings.signedOut}</span>
            ),
          },
        ];
      }
    }
  }

  render() {
    const { imgUrl, userName, isAdmin, isVisitor, isDirector } = this.state;

    return (
      <Grid>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/* User Dropdown */}
            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    {imgUrl && <Image src={imgUrl} spaced="right" avatar />}
                    {userName}
                  </span>
                }
                options={this.dropdownOptions(
                  isDirector,
                  isVisitor,
                  isAdmin,
                  this.props.wantsToGoAdminArea,
                  this.props.wantsToGoDashboard
                )}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
