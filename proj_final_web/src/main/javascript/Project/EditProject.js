import React from "react";
import {
  Button,
  Form,
  Modal,
  Grid,
  Input,
  Icon,
  Segment,
  Message,
  Dropdown,
  Header,
} from "semantic-ui-react";
import { projectsAPI } from "../util/APIs";
import { putData, requestHeaders } from "../util/Functions";
import { projectStateOptions, typologyOptions } from "../util/Constants";
import {
  projectStrings,
  systemStrings,
} from "../Localization/TranslationLanguages";

export default class EditProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      technicalManagerEmail: this.props.project.technicalManager.email,
      projectName: this.props.project.name,
      description: this.props.project.description,
      projectState: this.props.project.state,
      error: "",
      success: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleProjectStateChange = this.handleProjectStateChange.bind(this);
    this.buildUpdatedProject = this.buildUpdatedProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
  }

  updateProject() {
    putData(projectsAPI, requestHeaders(), this.buildUpdatedProject()).then(
      (response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            this.setState(
              {
                success: projectStrings.projectUpdate,
              },
              () => this.props.replaceEditedProject(data)
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
      }
    );
  }

  buildUpdatedProject() {
    return {
      id: this.props.project.id,
      technicalManagerEmail: this.state.technicalManagerEmail,
      name: this.state.projectName,
      description: this.state.description,
      state: this.state.projectState,
      manager: this.props.project.manager,
    };
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleProjectStateChange(e, { value }) {
    e.preventDefault();
    this.setState({
      projectState: value,
    });
  }

  projectStateIndex() {
    for (let i = 0; i < projectStateOptions().length; i++) {
      if (projectStateOptions()[i].value === this.props.project.state) {
        return i;
      }
    }
    return 0;
  }

  getTypologyText() {
    for (let i = 0; i < typologyOptions().length; i++) {
      if (typologyOptions()[i].value === this.props.project.typology) {
        return typologyOptions()[i].text;
      }
    }
    return "";
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          basic
          closeOnEscape={false}
          closeOnDimmerClick={false}
          trigger={
            <Icon onClick={() => this.setState({ success: "" })} name="edit" />
          }
          closeIcon
        >
          <Modal.Header>{projectStrings.editProject}</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.updateProject}>
              <Segment basic>
                <Grid textAlign="center" stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <Dropdown
                        defaultValue={
                          projectStateOptions()[this.projectStateIndex()].value
                        }
                        selection
                        options={projectStateOptions()}
                        onChange={this.handleProjectStateChange}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Input
                        fluid
                        label={projectStrings.manager}
                        labelPosition="left"
                        placeholder={this.props.project.manager.email}
                        readOnly
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Input
                        fluid
                        name="technicalManagerEmail"
                        label={projectStrings.technicalManager}
                        labelPosition="left"
                        type="email"
                        value={this.state.technicalManagerEmail}
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
                        value={this.state.projectName}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        fluid
                        label={systemStrings.code}
                        labelPosition="left"
                        placeholder={this.props.project.code}
                        readOnly
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
                        value={this.state.description}
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
                        type="text"
                        placeholder={new Date(
                          this.props.project.startDate
                        ).toLocaleDateString(localStorage.getItem("language"))}
                        readOnly
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Header inverted as="h4">
                        {systemStrings.endDate}
                      </Header>
                      <Input
                        type="text"
                        placeholder={new Date(
                          this.props.project.startDate
                        ).toLocaleDateString(localStorage.getItem("language"))}
                        readOnly
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns="2">
                    <Grid.Column>
                      <Input
                        fluid
                        label={projectStrings.clientName}
                        labelPosition="left"
                        placeholder={this.props.project.customerName}
                        readOnly
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        fluid
                        label={projectStrings.clientEmail}
                        labelPosition="left"
                        placeholder={this.props.project.customerEmail}
                        readOnly
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns="3">
                    <Grid.Column>
                      <Input
                        fluid
                        label={projectStrings.businessSegment}
                        labelPosition="left"
                        placeholder={this.props.project.businessSegment}
                        readOnly
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Input
                        label={projectStrings.typology}
                        labelPosition="left"
                        placeholder={this.getTypologyText()}
                        readOnly
                      />
                    </Grid.Column>

                    <Grid.Column>
                      <Input
                        fluid
                        label={systemStrings.cost}
                        labelPosition="left"
                        placeholder={this.props.project.budget + "€"}
                        readOnly
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
                      {projectStrings.updateProject}
                    </Button>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Form>
            {this.state.success.length > 0 && (
              <Message success>
                <h3>{systemStrings.success}</h3>
                {projectStrings.projectUpdate}
              </Message>
            )}
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

  isFormEmpty({ projectName, technicalManagerEmail, description }) {
    return (
      !projectName.length ||
      !technicalManagerEmail.length ||
      !description.length
    );
  }
}
