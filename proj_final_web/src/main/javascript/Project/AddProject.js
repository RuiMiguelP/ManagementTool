import React from "react";
import {
  Button,
  Form,
  Modal,
  Grid,
  Input,
  Dropdown,
  Segment,
  Message,
  Icon,
  Menu,
  Header,
} from "semantic-ui-react";
import {
  typologyOptions,
  alphanumericRegExp,
  doubleRegExp,
} from "../util/Constants";
import { usersAPI, projectsAPI } from "../util/APIs";
import AddProjectResources from "./AddProjectResources";
import { getData, postData, requestHeaders } from "../util/Functions";
import {
  projectStrings,
  systemStrings,
} from "../Localization/TranslationLanguages";

export default class AddProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      managerEmail: "",
      technicalManagerEmail: "",
      projectName: "",
      alphanumeric: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      customerName: "",
      customerEmail: "",
      businessSegment: "",
      typology: "",
      budget: "",
      error: "",
      success: "",
      showNewProjectModal: false,
      showAddResourcesModal: false,
      isCreateProject: false,
      isFormValid: false,
    };

    this.proceed = this.proceed.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTypologyChange = this.handleTypologyChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleShowAddProjectModal = this.handleShowAddProjectModal.bind(this);
    this.handleFetchAvailableUsers = this.handleFetchAvailableUsers.bind(this);
    this.handleShowAddResourcesModal = this.handleShowAddResourcesModal.bind(
      this
    );
    this.createProject = this.createProject.bind(this);
    this.updateUserList = this.updateUserList.bind(this);
    this.buildAllocationsArray = this.buildAllocationsArray.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  createProject(allocations) {
    postData(
      projectsAPI,
      requestHeaders(),
      this.buildProject(allocations)
    ).then((response) => {
      if (response.status == 201) {
        response.json().then((data) => {
          this.setState(
            {
              success: projectStrings.projectCreated,
            },
            () => this.props.addProjectToProjectList(data)
          );
        });
      } else if (response.status == 417) {
        this.setState({
          error: projectStrings.managerNotFound,
        });
      } else {
        this.setState({
          error: systemStrings.somethingWentWrong,
        });
      }
    });
  }

  buildProject(allocations) {
    return {
      code: this.state.alphanumeric,
      name: this.state.projectName,
      description: this.state.description,
      startDate: this.state.startDate.toISOString(),
      endDate: this.state.endDate.toISOString(),
      customerName: this.state.customerName,
      customerEmail: this.state.customerEmail,
      businessSegment: this.state.businessSegment,
      typology: this.state.typology,
      managerEmail: this.state.managerEmail,
      technicalManagerEmail: this.state.technicalManagerEmail,
      budget: this.state.budget,
      allocations: this.buildAllocationsArray(allocations),
    };
  }

  buildAllocationsArray(allocations) {
    let allocationsDTO = [];
    for (let i = 0; i < allocations.length; i++) {
      allocationsDTO.push({
        allocationPercentage: allocations[i].allocation,
        costPerHour: allocations[i].cost,
        startDate: allocations[i].startDate,
        endDate: allocations[i].endDate,
        userId: allocations[i].user.id,
      });
    }
    return allocationsDTO;
  }

  validateFields() {}

  handleFetchAvailableUsers() {
    getData(usersAPI.concat("/available"), requestHeaders()).then(
      (response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            this.setState({ users: data });
          });
        }
      }
    );
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleTypologyChange(e, { value }) {
    e.preventDefault();
    this.setState({
      typology: value,
    });
  }

  handleStartDateChange(e) {
    e.preventDefault();
    this.setState({
      startDate: new Date(e.target.value),
    });
  }

  handleEndDateChange(e) {
    e.preventDefault();
    this.setState({
      endDate: new Date(e.target.value),
    });
  }

  proceed() {
    if (this.isFormValid()) {
      postData(projectsAPI.concat("/validate"), requestHeaders(), {
        code: this.state.alphanumeric,
        managerEmail: this.state.managerEmail,
        technicalManagerEmail: this.state.technicalManagerEmail,
      }).then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            if (
              data.codeValid &&
              data.managerEmailValid &&
              data.technicalManagerEmailValid
            ) {
              this.setState(
                {
                  error: "",
                  showNewProjectModal: false,
                  showAddResourcesModal: true,
                  isCreateProject: true,
                },
                () => this.handleFetchAvailableUsers()
              );
            } else if (!data.codeValid) {
              this.setState({
                error: projectStrings.codeInUse,
              });
            } else if (
              !data.managerEmailValid ||
              !data.technicalManagerEmailValid
            ) {
              this.setState({
                error: projectStrings.managerNotFound,
              });
            }
          });
        } else {
          this.setState({
            error: systemStrings.somethingWentWrong,
          });
        }
      });
    }
  }

  isFormValid() {
    if (this.state.startDate > this.state.endDate) {
      this.setState({
        error: projectStrings.endDateAfter,
      });
      return false;
    }

    if (new Date(this.state.startDate) < new Date().setHours(0, 0)) {
      this.setState({
        error: projectStrings.startDateInTheFuture,
      });
      return false;
    }

    if (alphanumericRegExp.test(this.state.alphanumeric)) {
      this.setState({
        error: projectStrings.alphaOnlyLettersNumbers,
      });
      return false;
    }

    if (
      this.state.alphanumeric.length < 6 ||
      this.state.alphanumeric.length > 10
    ) {
      this.setState({
        error: projectStrings.alphaBetween6_10,
      });
      return false;
    }

    if (!doubleRegExp.test(this.state.budget)) {
      this.setState({
        error: projectStrings.budgetMustNumber,
      });
      return false;
    }

    return true;
  }

  handleShowAddProjectModal() {
    this.state.showNewProjectModal
      ? this.setState({
          showNewProjectModal: false,
        })
      : this.setState({
          showNewProjectModal: true,
          users: [],
          managerEmail: "",
          technicalManagerEmail: "",
          projectName: "",
          alphanumeric: "",
          description: "",
          startDate: new Date(),
          endDate: new Date(),
          customerName: "",
          customerEmail: "",
          businessSegment: "",
          typology: "",
          budget: "",
          error: "",
          success: "",
        });
  }

  handleShowAddResourcesModal() {
    this.state.showAddResourcesModal
      ? this.setState({
          showAddResourcesModal: false,
        })
      : this.setState({
          showAddResourcesModal: true,
        });
  }

  updateUserList(users) {
    this.setState({
      users,
    });
  }

  render() {
    return (
      <React.Fragment>
        <AddProjectResources
          users={this.state.users}
          open={this.state.showAddResourcesModal}
          close={this.handleShowAddResourcesModal}
          projStartDate={this.state.startDate}
          projEndDate={this.state.endDate}
          createProject={this.createProject}
          error={this.state.error}
          success={this.state.success}
          updateUserList={this.updateUserList}
          isCreateProject={this.state.isCreateProject}
        />
        <Modal
          basic
          open={this.state.showNewProjectModal}
          onClose={this.handleShowAddProjectModal}
          closeOnEscape={false}
          closeOnDimmerClick={false}
          trigger={
            <Menu.Item
              className="sidebar_add_project"
              style={{ opacity: 0.7 }}
              onClick={this.handleShowAddProjectModal}
            >
              <span>
                <Icon name="add" />
                {systemStrings.addProject}
              </span>
            </Menu.Item>
          }
          closeIcon
        >
          <Modal.Header> {systemStrings.addProject}</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.proceed}>
              <Segment basic>
                <Grid textAlign="center" stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <Input
                        fluid
                        name="managerEmail"
                        type="email"
                        label={projectStrings.manager}
                        labelPosition="left"
                        placeholder={projectStrings.projectManagerEmail}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Input
                        fluid
                        name="technicalManagerEmail"
                        type="email"
                        label={projectStrings.technicalManager}
                        labelPosition="left"
                        placeholder={projectStrings.projectTechManagerEmail}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns="2">
                    <Grid.Column>
                      <Input
                        name="projectName"
                        fluid
                        label={systemStrings.name}
                        labelPosition="left"
                        placeholder={projectStrings.projectName}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        name="alphanumeric"
                        fluid
                        label={systemStrings.code}
                        labelPosition="left"
                        placeholder={projectStrings.alphanumeric}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Input
                        name="description"
                        fluid
                        label={projectStrings.description}
                        labelPosition="left"
                        type="text"
                        placeholder={projectStrings.description}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns="2">
                    <Grid.Column>
                      <Header inverted as="h4">
                        {systemStrings.startDate}
                      </Header>
                      <Input
                        type="date"
                        name="startDate"
                        onChange={this.handleStartDateChange}
                        value={this.state.startDate.toISOString().substr(0, 10)}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Header inverted as="h4">
                        {systemStrings.endDate}
                      </Header>
                      <Input
                        type="date"
                        name="endDate"
                        onChange={this.handleEndDateChange}
                        value={this.state.endDate.toISOString().substr(0, 10)}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns="2">
                    <Grid.Column>
                      <Input
                        name="customerName"
                        fluid
                        label={projectStrings.clientName}
                        labelPosition="left"
                        placeholder={projectStrings.clientName}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        name="customerEmail"
                        fluid
                        label={projectStrings.clientEmail}
                        labelPosition="left"
                        type="email"
                        placeholder={projectStrings.clientEmail}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns="3">
                    <Grid.Column>
                      <Input
                        name="businessSegment"
                        fluid
                        label={projectStrings.businessSegment}
                        labelPosition="left"
                        placeholder={projectStrings.businessSegment}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Dropdown
                        placeholder={projectStrings.typology}
                        options={typologyOptions()}
                        selection
                        onChange={this.handleTypologyChange}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        name="budget"
                        fluid
                        label={systemStrings.cost}
                        labelPosition="left"
                        placeholder={projectStrings.budget + " €"}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Button
                      disabled={this.isFormEmpty(this.state)}
                      color="teal"
                      fluid
                      size="medium"
                    >
                      {projectStrings.proceed}
                    </Button>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Form>
            {this.state.error.length > 0 && (
              <Message error>
                <h3>{systemStrings.error}</h3>
                {this.state.error}
              </Message>
            )}
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }

  isFormEmpty({
    managerEmail,
    technicalManagerEmail,
    projectName,
    alphanumeric,
    description,
    customerName,
    customerEmail,
    businessSegment,
    typology,
    budget,
  }) {
    return (
      !managerEmail.length ||
      !technicalManagerEmail.length ||
      !projectName.length ||
      !alphanumeric.length ||
      !description.length ||
      !customerName.length ||
      !customerEmail.length ||
      !businessSegment.length ||
      !typology.length ||
      !budget.length
    );
  }
}
