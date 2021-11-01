"use strict";

import React from "react";

import {
  Menu,
  Header,
  Icon,
  Container,
  Button,
  Segment,
} from "semantic-ui-react";
import { checkMobile, checkProfileUserOrDirector } from "../util/Functions";
import { systemStrings } from "../Localization/TranslationLanguages";

export default class TopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirector: JSON.parse(localStorage.getItem("isDirector")),
      isManager: JSON.parse(localStorage.getItem("isManager")),
      isUser: JSON.parse(localStorage.getItem("isUser")),
      isVisitor: JSON.parse(localStorage.getItem("isVisitor")),
    };
  }

  render() {
    return <React.Fragment>{this.condicionalRender()}</React.Fragment>;
  }

  condicionalRender() {
    if (checkMobile()) {
      return (
        <Menu
          fixed="top"
          inverted
          pointing
          secondary
          className="top_nav_segment_mobile"
          size="large"
        >
          <Menu.Item
            compact="true"
            inverted
            onClick={this.props.handleSidebarVisible}
          >
            <Icon size="large" name="sidebar" />
          </Menu.Item>
          {checkProfileUserOrDirector() &&
            !this.props.wantsToGoAdminArea &&
            !this.props.wantsToGoDashboard &&
            !this.state.isVisitor && (
              <Menu.Item position="right">
                <Button
                  as="a"
                  inverted
                  className="button_top_bar"
                  onClick={this.props.goToProjectView}
                  active={this.props.wantsToGoProjectView}
                >
                  {systemStrings.projectView}
                </Button>
                <Button
                  as="a"
                  inverted
                  className="button_top_bar"
                  onClick={this.props.goToActivityPanel}
                  active={this.props.wantsToGoActivityPanel}
                >
                  {systemStrings.activities}
                </Button>
                {(this.state.isDirector || this.state.isManager) && (
                  <Button
                    as="a"
                    inverted
                    className="button_top_bar"
                    onClick={this.props.goToResourcePanel}
                    active={this.props.wantsToGoResourcePanel}
                  >
                    {systemStrings.resources}
                  </Button>
                )}
              </Menu.Item>
            )}
        </Menu>
      );
    } else {
      return (
        <Menu
          className="topNav"
          fixed="top"
          inverted
          pointing
          secondary
          size="large"
          fluid
        >
          <Menu.Item position="left">
            <Header inverted floated="left" as="h4">
              <Icon name="wpforms"></Icon>
              <Header.Content>Project Management App</Header.Content>
            </Header>
          </Menu.Item>
          {checkProfileUserOrDirector() &&
            !this.props.wantsToGoAdminArea &&
            !this.props.wantsToGoDashboard &&
            !this.state.isVisitor && (
              <div className="topNavMenus">
                <Menu.Item
                  as="a"
                  active={this.props.wantsToGoProjectView}
                  onClick={this.props.goToProjectView}
                >
                  {systemStrings.projectView}
                </Menu.Item>
                <Menu.Item
                  as="a"
                  active={this.props.wantsToGoActivityPanel}
                  onClick={this.props.goToActivityPanel}
                >
                  {systemStrings.activities}
                </Menu.Item>
                {(JSON.parse(localStorage.getItem("isDirector")) ||
                  JSON.parse(localStorage.getItem("isManager"))) && (
                  <Menu.Item
                    as="a"
                    active={this.props.wantsToGoResourcePanel}
                    onClick={this.props.goToResourcePanel}
                  >
                    {systemStrings.resources}
                  </Menu.Item>
                )}
              </div>
            )}
        </Menu>
      );
    }
  }
}
