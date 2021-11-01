import React from "react";
import {
  Label,
  Grid,
  Divider,
  Icon,
  Input,
  Message,
  Accordion,
  Button,
  Header,
} from "semantic-ui-react";

import { systemStrings } from "../Localization/TranslationLanguages";

class AllocationsReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      startDate: new Date(),
      endDate: new Date(),
      projects: props.projects,
      error: "",
      filteredProjects: props.projects,
      isDirector: JSON.parse(localStorage.getItem("isDirector")),
      isManager: JSON.parse(localStorage.getItem("isManager")),
      uid: localStorage.getItem("uid"),
    };
    this.setActiveIndex = this.setActiveIndex.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.filterProjects = this.filterProjects.bind(this);
    this.retrieveAllResources = this.retrieveAllResources.bind(this);
    this.retrieveUserResource = this.retrieveUserResource.bind(this);
    this.areDatesValid = this.areDatesValid.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
  }

  resetSearch() {
    this.setState({
      filteredProjects: this.state.projects,
      startDate: new Date(),
      endDate: new Date(),
    });
  }

  setActiveIndex(event, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  handleStartDateChange(e) {
    e.preventDefault();
    let startDate = new Date(e.target.value);
    this.areDatesValid(startDate, this.state.endDate);
  }

  handleEndDateChange(e) {
    e.preventDefault();
    let endDate = new Date(e.target.value);
    this.areDatesValid(this.state.startDate, endDate);
  }

  filterProjects() {
    let filteredProjects = [];
    filteredProjects = this.state.projects.filter((project) => {
      let startDate = new Date(project.startDate);
      let endDate = new Date(project.endDate);
      {
        return (
          (startDate > this.state.startDate &&
            startDate < this.state.endDate) ||
          (endDate > this.state.startDate && endDate < this.state.endDate)
        );
      }
    });
    this.setState({
      filteredProjects: filteredProjects,
    });
  }

  areDatesValid(startDate, endDate) {
    if (startDate > endDate) {
      this.setState({
        startDate: startDate,
        endDate: endDate,
        error: "Start Date must be before End Date.",
      });
      return false;
    }
    this.setState(
      {
        filteredProjects: this.state.projects,
        startDate,
        endDate,
        error: "",
      },
      () => this.filterProjects()
    );
    return true;
  }

  render() {
    const {
      activeIndex,
      startDate,
      endDate,
      filteredProjects,
      isDirector,
      isManager,
      uid,
    } = this.state;

    return (
      <React.Fragment>
        <Grid columns="equal" className="app" stackable>
          <Grid.Column className="panel_manage_users">
            <Label>{systemStrings.allocationReport_two_points}</Label>
            <Divider />
            <Label horizontal size="large">
              {systemStrings.startDate}
              <Input
                type="date"
                name="startDate"
                onChange={this.handleStartDateChange}
                value={startDate.toISOString().substr(0, 10)}
              />
            </Label>
            <Label horizontal size="large">
              {systemStrings.endDate}
              <Input
                type="date"
                name="endDate"
                onChange={this.handleEndDateChange}
                value={endDate.toISOString().substr(0, 10)}
              />
            </Label>
            {"  "}
            <Button circular icon="refresh" onClick={this.resetSearch} />
            {this.state.error.length > 0 && (
              <Message error>
                <h3> {systemStrings.error}</h3>
                {this.state.error}
              </Message>
            )}
            <Header as="h3" attached="top">
              {systemStrings.projects}
            </Header>
            {filteredProjects.map((project) => (
              <Accordion fluid styled attached="true">
                <Accordion.Title
                  active={activeIndex === project.id}
                  index={project.id}
                  onClick={this.setActiveIndex}
                >
                  <Icon name="dropdown" />
                  <Icon name="info" /> {project.name}
                  {"  "}
                  <Label basic>
                    {" "}
                    {systemStrings.startDate}: {project.startDate.substr(0, 10)}
                  </Label>
                  {"  "}
                  <Label basic>
                    {" "}
                    {systemStrings.endDate}: {project.endDate.substr(0, 10)}
                  </Label>
                </Accordion.Title>
                {project.manager.id == uid || isDirector
                  ? this.retrieveAllResources(project)
                  : this.retrieveUserResource(project)}
              </Accordion>
            ))}
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }

  retrieveUserResource(project) {
    const { uid, activeIndex } = this.state;
    return (
      <Accordion.Content active={activeIndex === project.id}>
        <Grid stackable textAlign="center">
          <Grid.Row columns={4}>
            <Grid.Column>
              <Header as="h4">{systemStrings.name}</Header>
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">{systemStrings.email}</Header>
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">{systemStrings.allocation_percent_sign}</Header>
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">{systemStrings.cost}</Header>
            </Grid.Column>
          </Grid.Row>

          {project.allocations.map((allocation) => {
            return (
              allocation.user.id == uid && (
                <Grid.Row columns={4}>
                  <Grid.Column>
                    <Label circular size="large">
                      <Icon name="user" fitted />
                    </Label>
                    <Input
                      key={allocation.id}
                      icon="id card"
                      iconPosition="left"
                      readOnly
                      value={allocation.user.name}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      icon="mail"
                      iconPosition="left"
                      readOnly
                      value={allocation.user.email}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      icon="percent"
                      iconPosition="left"
                      readOnly
                      value={allocation.allocationPercentage}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      icon="euro"
                      iconPosition="left"
                      readOnly
                      value={allocation.costPerHour}
                    />
                  </Grid.Column>
                </Grid.Row>
              )
            );
          })}
        </Grid>
      </Accordion.Content>
    );
  }

  retrieveAllResources(project) {
    const { activeIndex } = this.state;

    return (
      <Accordion.Content active={activeIndex === project.id}>
        <Grid stackable textAlign="center">
          <Grid.Row columns={4}>
            <Grid.Column>
              <Header as="h4">{systemStrings.name}</Header>
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">{systemStrings.email}</Header>
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">{systemStrings.allocation_percent_sign}</Header>
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">{systemStrings.cost}</Header>
            </Grid.Column>
          </Grid.Row>
          {project.allocations.map((allocation) => {
            return (
              <Grid.Row columns={4}>
                <Grid.Column>
                  <Label size="large" style={{ color: "#787878" }}>
                    <Icon name="id card" />
                    {allocation.user.name}
                  </Label>
                </Grid.Column>
                <Grid.Column>
                  <Label size="large" style={{ color: "#787878" }}>
                    <Icon name="mail" />
                    {allocation.user.email}
                  </Label>
                </Grid.Column>
                <Grid.Column>
                  <Label size="large" style={{ color: "#787878" }}>
                    <Icon name="percent" />
                    {allocation.allocationPercentage}
                  </Label>
                </Grid.Column>
                <Grid.Column>
                  <Label size="large" style={{ color: "#787878" }}>
                    <Icon name="euro" />
                    {allocation.costPerHour}
                  </Label>
                </Grid.Column>
              </Grid.Row>
            );
          })}
        </Grid>
      </Accordion.Content>
    );
  }
}

export default AllocationsReport;
