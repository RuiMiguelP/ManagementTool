"use strict";

import React from "react";
import TopNav from "./TopNav";
import SidebarMenu from "./SidebarMenu";
import { checkMobile } from "../util/Functions";
import ManageRoles from "../Users/ManageRoles";
import { Grid, Segment, Message, Button } from "semantic-ui-react";
import ActivityPanel from "../Activity/ActivityPanel";
import MainNav from "../MainArea/MainNav";
import ProjectView from "../Project/ProjectView";
import ResourcePanel from "../Activity/ResourcePanel";
import { projectsAPI, usersAPI } from "../util/APIs";
import { getData, putData, requestHeaders } from "../util/Functions";
import DashboardPanel from "../Dashboard/DashboardPanel";
import Notification from "../WebSockets/Notification";
import { systemStrings } from "../Localization/TranslationLanguages";

class MainPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      firstLoad: true,
      selectedProject: {},
      sidebarVisible: false,
      wantsToGoAdminArea: false,
      wantsToGoProjectView: false,
      wantsToGoActivityPanel: false,
      wantsToGoResourcePanel: false,
      wantsToGoDashboard: false,
      wantsToGoAllocationsReport: false,
      wantsToGoIndicatorsReport: false,
      isVisitor: JSON.parse(localStorage.getItem("isVisitor")),
      emailSent: false,
      success: "",
      error: "",
    };
    this.handleSidebarVisible = this.handleSidebarVisible.bind(this);
    this.loadProjects = this.loadProjects.bind(this);
    this.setFirstProject = this.setFirstProject.bind(this);
    this.setProject = this.setProject.bind(this);
    this.setNewActivityToProject = this.setNewActivityToProject.bind(this);
    this.updateActivity = this.updateActivity.bind(this);
    this.addProjectToProjectList = this.addProjectToProjectList.bind(this);
    this.sendEmailToUpgrade = this.sendEmailToUpgrade.bind(this);
    this.setNewResourceToProject = this.setNewResourceToProject.bind(this);
    this.replaceEditedProject = this.replaceEditedProject.bind(this);
    this.addProjectWs = this.addProjectWs.bind(this);
    this.updateActivityWs = this.updateActivityWs.bind(this);
    this.setNewActivityWs = this.setNewActivityWs.bind(this);
    this.setNewResourceWs = this.setNewResourceWs.bind(this);
    this.updateUserWs = this.updateUserWs.bind(this);
    this.replaceEditedProjectWs = this.replaceEditedProjectWs.bind(this);
  }

  componentDidMount() {
    this.handleSidebarVisible();
    this.loadProjects();
  }

  loadProjects() {
    getData(projectsAPI, requestHeaders())
      .then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            this.setState(
              {
                projects: data,
              },
              () => this.setFirstProject()
            );
          });
        } else {
          console.error("loadProjects > " + data);
        }
      })
      .catch((error) => {
        console.error("loadProjects > " + error);
      });
  }

  sendEmailToUpgrade() {
    putData(usersAPI.concat("/upgrade"), requestHeaders()).then((response) => {
      if (response.status == 200) {
        this.setState({
          success: systemStrings.emailSent,
          emailSent: true,
        });
      } else {
        this.setState({
          error: systemStrings.somethingWentWrong,
        });
      }
    });
  }

  setFirstProject() {
    if (this.state.firstLoad && this.state.projects.length > 0) {
      this.setState(
        {
          selectedProject: this.state.projects[0],
        },
        () => this.checkIfProjectManager()
      );
      localStorage.setItem("selectedProject", this.state.projects[0].id);
    }
    this.setState(
      {
        firstLoad: false,
      },
      () => this.checkIfProjectManager()
    );
  }

  setProject(id) {
    let index = this.state.projects.findIndex((project) => project.id == id);

    this.setState(
      {
        selectedProject: this.state.projects[index],
      },
      () => this.checkIfProjectManager()
    );
    localStorage.setItem("selectedProject", id);
  }

  checkIfProjectManager() {
    if (this.state.projects.length > 0) {
      if (
        this.state.selectedProject.manager.id == localStorage.getItem("uid")
      ) {
        localStorage.setItem("isManager", true);
      } else {
        localStorage.setItem("isManager", false);
      }
    } else {
      localStorage.setItem("isManager", false);
    }
    this.setState({
      wantsToGoAdminArea: false,
      wantsToGoProjectView: true,
      wantsToGoActivityPanel: false,
      wantsToGoResourcePanel: false,
      wantsToGoDashboard: false,
    });
  }

  setNewActivityToProject(activity) {
    let projects = [...this.state.projects];

    let selectedProject = {};
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === activity.projectId) {
        projects[i].activities.push(activity);
        selectedProject = projects[i];
      }
    }

    this.setState({
      projects,
      selectedProject,
    });
  }

  setNewActivityWs(activity) {
    let projects = [...this.state.projects];

    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === activity.projectId) {
        projects[i].activities.push(activity);
      }
    }

    this.setState({
      projects,
    });
  }

  setNewResourceToProject(resources) {
    let projects = [...this.state.projects];
    let selectedProject;

    for (let i = 0; i < projects.length; i++) {
      for (let j = 0; j < resources.length; j++) {
        if (projects[i].id === resources[j].projectId) {
          projects[i].allocations.push(resources[j]);
          selectedProject = projects[i];
        }
      }
    }

    this.setState({
      projects,
      selectedProject,
    });
  }

  setNewResourceWs(resources) {
    let projects = [...this.state.projects];

    for (let i = 0; i < projects.length; i++) {
      for (let j = 0; j < resources.length; j++) {
        if (projects[i].id === resources[j].projectId) {
          projects[i].allocations.push(resources[j]);
        }
      }
    }

    this.setState({
      projects,
    });
  }

  addProjectToProjectList(project) {
    let projectsList = [...this.state.projects];
    projectsList.push(project);

    this.setState(
      {
        projects: projectsList,
      },
      () => this.setProject(project.id)
    );
  }

  addProjectWs(project) {
    let projectsList = [...this.state.projects];
    projectsList.push(project);

    this.setState({
      projects: projectsList,
    });
  }

  replaceEditedProject(project) {
    let projects = [...this.state.projects];
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === project.id) {
        projects.splice(i, 1, project);
      }
    }

    this.setState({ projects }, () => this.setProject(project.id));
  }

  updateActivity(activity) {
    let projects = [...this.state.projects];

    let selectedProject = {};
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === activity.projectId) {
        for (let j = 0; j < projects[i].activities.length; j++) {
          if (projects[i].activities[j].id === activity.id) {
            projects[i].activities.splice(j, 1, activity);
            selectedProject = projects[i];
          }
        }
      }
    }

    this.setState({
      projects,
      selectedProject,
    });
  }

  updateActivityWs(activity) {
    let projects = [...this.state.projects];

    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === activity.projectId) {
        for (let j = 0; j < projects[i].activities.length; j++) {
          if (projects[i].activities[j].id === activity.id) {
            projects[i].activities.splice(j, 1, activity);
          }
        }
      }
    }

    this.setState({
      projects,
    });
  }

  updateUserWs(user) {
    localStorage.setItem("isAdmin", user.admin);
    localStorage.setItem("isDirector", user.director);
    localStorage.setItem("isVisitor", user.visitor);
    localStorage.setItem("isUser", user.user);
    this.props.onLogin();
  }

  replaceEditedProjectWs(project) {
    let projects = [...this.state.projects];
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === project.id) {
        projects.splice(i, 1, project);
      }
    }

    this.setState({ projects });
  }

  render() {
    return (
      <React.Fragment>
        <TopNav
          wantsToGoProjectView={this.state.wantsToGoProjectView}
          wantsToGoActivityPanel={this.state.wantsToGoActivityPanel}
          wantsToGoResourcePanel={this.state.wantsToGoResourcePanel}
          wantsToGoAdminArea={this.state.wantsToGoAdminArea}
          wantsToGoDashboard={this.state.wantsToGoDashboard}
          handleSidebarVisible={this.handleSidebarVisible}
          goToProjectView={() =>
            this.setState({
              wantsToGoAdminArea: false,
              wantsToGoProjectView: true,
              wantsToGoActivityPanel: false,
              wantsToGoResourcePanel: false,
              wantsToGoDashboard: false,
            })
          }
          goToActivityPanel={() =>
            this.setState({
              wantsToGoAdminArea: false,
              wantsToGoProjectView: false,
              wantsToGoActivityPanel: true,
              wantsToGoResourcePanel: false,
              wantsToGoDashboard: false,
            })
          }
          goToResourcePanel={() =>
            this.setState({
              wantsToGoAdminArea: false,
              wantsToGoProjectView: false,
              wantsToGoActivityPanel: false,
              wantsToGoResourcePanel: true,
              wantsToGoDashboard: false,
            })
          }
        />
        <SidebarMenu
          projects={this.state.projects}
          selectedProject={this.state.selectedProject}
          setProject={this.setProject}
          handleSidebarVisible={this.handleSidebarVisible}
          visible={this.state.sidebarVisible}
          goToAdminArea={() =>
            this.setState({
              wantsToGoAdminArea: true,
              wantsToGoProjectView: false,
              wantsToGoDashboard: false,
              wantsToGoActivityPanel: false,
              wantsToGoResourcePanel: false,
            })
          }
          goToMainPanel={() =>
            this.setState({
              wantsToGoAdminArea: false,
              wantsToGoProjectView: true,
              wantsToGoDashboard: false,
              wantsToGoActivityPanel: false,
              wantsToGoResourcePanel: false,
            })
          }
          goToDashboard={() =>
            this.setState({
              wantsToGoAdminArea: false,
              wantsToGoProjectView: false,
              wantsToGoDashboard: true,
              wantsToGoActivityPanel: false,
              wantsToGoResourcePanel: false,
            })
          }
          goToAllocationsReport={() =>
            this.setState({
              wantsToGoAllocationsReport: true,
              wantsToGoIndicatorsReport: false,
            })
          }
          goToIndicatorsReport={() =>
            this.setState({
              wantsToGoAllocationsReport: false,
              wantsToGoIndicatorsReport: true,
            })
          }
          wantsToGoAdminArea={this.state.wantsToGoAdminArea}
          wantsToGoDashboard={this.state.wantsToGoDashboard}
          logout={this.props.logout}
          addProjectToProjectList={this.addProjectToProjectList}
          replaceEditedProject={this.replaceEditedProject}
          updateLanguage={this.props.updateLanguage}
        />
        {this.state.isVisitor ? (
          <Segment
            textAlign="center"
            style={{ marginTop: "5em", marginLeft: this.handleSegmentMargin() }}
            basic
          >
            <Message warning>
              <Message.Header>{systemStrings.upgradeFirst}</Message.Header>
              <Message.Content>{systemStrings.registeredOnly}</Message.Content>
            </Message>
            <Button
              onClick={this.sendEmailToUpgrade}
              color="teal"
              size="medium"
              disabled={this.state.emailSent}
            >
              {systemStrings.askToUpgrade}
            </Button>
            {this.state.success.length > 0 && (
              <Message success>
                <h3>{systemStrings.success}</h3>
                {systemStrings.emailSent}
              </Message>
            )}
            {this.state.error.length > 0 && (
              <Message error>
                <h3>{systemStrings.error}</h3>
                {systemStrings.somethingWentWrong}
              </Message>
            )}
          </Segment>
        ) : (
          <Segment
            style={{ marginTop: "5em", marginLeft: this.handleSegmentMargin() }}
            basic
          >
            <Grid.Column>
              {this.state.wantsToGoDashboard && (
                <DashboardPanel
                  wantsToGoAllocationsReport={
                    this.state.wantsToGoAllocationsReport
                  }
                  wantsToGoIndicatorsReport={
                    this.state.wantsToGoIndicatorsReport
                  }
                  projects={this.state.projects}
                />
              )}
              {this.state.wantsToGoAdminArea ? (
                <ManageRoles globalUsers={this.state.globalUsers} />
              ) : (
                <MainNav>
                  {this.state.wantsToGoProjectView && (
                    <ProjectView selectedProject={this.state.selectedProject} />
                  )}
                  {this.state.wantsToGoActivityPanel && (
                    <ActivityPanel
                      selectedProject={this.state.selectedProject}
                      setActivity={this.setNewActivityToProject}
                      updateActivity={this.updateActivity}
                    />
                  )}
                  {this.state.wantsToGoResourcePanel && (
                    <ResourcePanel
                      selectedProject={this.state.selectedProject}
                      setResource={this.setNewResourceToProject}
                    />
                  )}
                </MainNav>
              )}
            </Grid.Column>
          </Segment>
        )}
        <Notification
          setNewActivityWs={this.setNewActivityWs}
          addProjectWs={this.addProjectWs}
          setNewResourceWs={this.setNewResourceWs}
          updateActivityWs={this.updateActivityWs}
          updateUserWs={this.updateUserWs}
          replaceEditedProjectWs={this.replaceEditedProjectWs}
          logout={this.props.logout}
          messageWarning={this.props.messageWarning}
        />
      </React.Fragment>
    );
  }

  handleSegmentMargin() {
    if (checkMobile()) {
      return "0px";
    }
    return "260px";
  }

  handleSidebarVisible() {
    checkMobile()
      ? this.setState({ sidebarVisible: !this.state.sidebarVisible })
      : this.setState({ sidebarVisible: true });
  }
}

export default MainPanel;
