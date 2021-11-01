"use strict";

import React from "react";
import { Responsive, Sidebar, Menu } from "semantic-ui-react";
import UserPanel from "../Users/UserPanel";
import ProjectList from "../Project/ProjectList";
import { checkMobile, checkProfileUserOrDirector } from "../util/Functions";
import AddProject from "../Project/AddProject";
import MenuDashboard from "../Dashboard/MenuDashboard";
import MenuLocalization from "./MenuLocalization";

export default class SidebarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minWidth: 0,
      maxWidth: 20000,
      currentViewMode: true,
      isVisitor: JSON.parse(localStorage.getItem("isVisitor")),
    };
  }

  handleCurrentView() {
    if (this.state.currentViewMode != checkMobile()) {
      this.props.handleSidebarVisible();
      this.setState({ currentViewMode: checkMobile() });
    }
  }

  handleSidebarAnimation() {
    if (checkMobile()) {
      return "overlay";
    }
    return "push";
  }

  render() {
    return (
      <React.Fragment>
        <Responsive onUpdate={() => this.handleCurrentView()} />
        <Sidebar
          className="main-sidebar"
          animation={this.handleSidebarAnimation()}
          direction="left"
          visible={this.props.visible}
          size="large"
          inverted="true"
          fixed="left"
          vertical="true"
        >
          <Menu
            size="large"
            inverted
            vertical
            fixed="left"
            style={{
              width: "250px",
              background: "#303641",
              fontSize: "1.2rem",
            }}
          >
            <UserPanel
              logout={this.props.logout}
              wantsToGoAdminArea={this.props.wantsToGoAdminArea}
              wantsToGoDashboard={this.props.wantsToGoDashboard}
              goToAdminArea={this.props.goToAdminArea}
              goToDashboard={this.props.goToDashboard}
              goToMainPanel={this.props.goToMainPanel}
              logout={this.props.logout}
            />
            <MenuLocalization updateLanguage={this.props.updateLanguage} />
            {this.props.wantsToGoDashboard && (
              <MenuDashboard
                goToAllocationsReport={this.props.goToAllocationsReport}
                goToIndicatorsReport={this.props.goToIndicatorsReport}
              />
            )}

            {checkProfileUserOrDirector() &&
              !this.props.wantsToGoDashboard &&
              !this.props.wantsToGoAdminArea &&
              !this.state.isVisitor && (
                <ProjectList
                  projects={this.props.projects}
                  selectedProject={this.props.selectedProject}
                  setProject={this.props.setProject}
                  goToMainPanel={this.props.goToMainPanel}
                  replaceEditedProject={this.props.replaceEditedProject}
                />
              )}

            {JSON.parse(localStorage.getItem("isDirector")) &&
              !this.props.wantsToGoDashboard &&
              !this.props.wantsToGoAdminArea && (
                <AddProject
                  addProjectToProjectList={this.props.addProjectToProjectList}
                />
              )}
          </Menu>
        </Sidebar>
      </React.Fragment>
    );
  }
}
