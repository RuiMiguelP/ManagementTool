import React from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Message,
  Grid,
  Segment,
  Icon,
  Table,
  Dropdown,
  Label,
  Checkbox,
  Header,
} from "semantic-ui-react";

import { projectsAPI } from "../util/APIs";
import { postData, requestHeaders } from "../util/Functions";
import { activityType } from "../util/Constants";

import {
  systemStrings,
  activityStrings,
  projectStrings,
} from "../Localization/TranslationLanguages";

class AddActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      success: "",
      allocations: [],
      project: {},
      chosenAllocation: {},
      activityName: "",
      description: "",
      type: activityType()[0].value,
      startDate: new Date(),
      endDate: new Date(),
      hoursLeft: 0,
      addPrecedents: false,
      precedents: [],
    };

    this.loadProjectWithAllocations = this.loadProjectWithAllocations.bind(
      this
    );
    this.chooseAllocation = this.chooseAllocation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.areDatesValid = this.areDatesValid.bind(this);
    this.createActivity = this.createActivity.bind(this);
    this.addPrecedents = this.addPrecedents.bind(this);
  }

  loadProjectWithAllocations() {
    var startDate = new Date();
    startDate.setHours(1);

    var endDate = new Date();
    endDate.setHours(23);

    this.setState({
      allocationChosed: false,
      allocations: this.props.selectedProject.allocations,
      project: this.props.selectedProject,
      chosenAllocation: {},
      activityName: "",
      description: "",
      precedents: [],
      success: "",
      startDate,
      endDate,
    });
  }

  createActivity() {
    postData(
      projectsAPI
        .concat("/")
        .concat(this.state.project.id)
        .concat("/activities"),
      requestHeaders(),
      this.buildActivity()
    ).then((response) => {
      if (response.status == 201) {
        response.json().then((data) => {
          this.setState(
            {
              success: activityStrings.activityCreated,
              activityName: "",
              description: "",
              type: activityType()[0].value,
              startDate: new Date(),
              endDate: new Date(),
              hoursLeft: 0,
              addPrecedents: false,
              precedents: [],
            },
            this.props.setActivity(data)
          );
        });
      } else {
        this.setState({
          error: systemStrings.somethingWentWrong,
        });
      }
    });
  }

  buildActivity() {
    return {
      name: this.state.activityName,
      description: this.state.description,
      type: this.state.type,
      startDate: this.state.startDate.toISOString(),
      endDate: this.state.endDate.toISOString(),
      hoursLeft: this.state.hoursLeft,
      allocationId: this.state.chosenAllocation.id,
      precedentsId: this.state.precedents,
    };
  }

  chooseAllocation(allocation) {
    this.setState(
      {
        chosenAllocation: allocation,
        allocationChosed: true,
        addPrecedents: false,
        precedents: [],
      },
      () => this.areDatesValid(this.state.startDate, this.state.endDate)
    );
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
      success: "",
    });
  }

  handleTypeChange(e, { value }) {
    e.preventDefault();
    this.setState({
      type: value,
    });
  }

  handleStartDateChange(e) {
    e.preventDefault();
    let startDate = new Date(e.target.value);

    startDate.setHours(1, 0);
    this.areDatesValid(startDate, this.state.endDate);
  }

  handleEndDateChange(e) {
    e.preventDefault();
    let endDate = new Date(e.target.value);

    endDate.setHours(22, 59);
    this.areDatesValid(this.state.startDate, endDate);
  }

  areDatesValid(startDate, endDate) {
    if (startDate < new Date().setHours(0, 0)) {
      this.setState(
        {
          startDate: startDate,
          endDate: endDate,
          error: activityStrings.startDateInTheFuture,
        },
        () => this.calcHoursLeft()
      );
      return false;
    } else if (
      startDate < new Date(this.state.chosenAllocation.startDate).setHours(0, 0)
    ) {
      this.setState(
        {
          startDate: startDate,
          endDate: endDate,
          error: activityStrings.startDateCannoBeBeforeAllocation,
        },
        () => this.calcHoursLeft()
      );
      return false;
    } else if (
      endDate >= new Date(this.state.chosenAllocation.endDate).setHours(23, 59)
    ) {
      this.setState(
        {
          startDate: startDate,
          endDate: endDate,
          error: activityStrings.endDateCannotBeAfterAllocation,
        },
        () => this.calcHoursLeft()
      );
      return false;
    } else if (startDate > endDate) {
      this.setState(
        {
          startDate: startDate,
          endDate: endDate,
          error: activityStrings.startDateBeforeEndDate,
        },
        () => this.calcHoursLeft()
      );
      return false;
    }
    this.setState(
      {
        startDate: startDate,
        endDate: endDate,
        error: "",
      },
      () => this.calcHoursLeft()
    );
    return true;
  }

  isFormValid() {
    if (
      this.state.activityName.length === 0 ||
      this.state.description.length === 0 ||
      this.state.error.length > 0 ||
      !this.checkAllocationAvailability()
    ) {
      return false;
    }
    return true;
  }

  calcHoursLeft() {
    var startDate = new Date(this.state.startDate.getTime());

    var businessDays = 0;
    while (startDate < this.state.endDate) {
      if (startDate.getDay() != 6 && startDate.getDay() != 0) {
        businessDays++;
      }
      startDate.setDate(startDate.getDate() + 1);
    }
    var dailyHours =
      8 / (100 / this.state.chosenAllocation.allocationPercentage);

    this.setState({ hoursLeft: Math.ceil(businessDays * dailyHours) });
  }

  addPrecedents(e, { value }) {
    e.preventDefault();
    let precedents = [...this.state.precedents];

    let alreadySelected = false;

    for (let i = 0; i < precedents.length; i++) {
      if (value == precedents[i]) {
        alreadySelected = true;
      }
    }

    if (alreadySelected) {
      precedents = precedents.filter((id) => {
        return id != value.toString();
      });
    } else {
      precedents.push(value.toString());
    }
    this.setState({
      precedents,
    });
  }

  checkAllocationAvailability() {
    let activities = [...this.props.selectedProject.activities];

    const { chosenAllocation, startDate, endDate } = this.state;

    for (let i = 0; i < activities.length; i++) {
      if (activities[i].allocation.id === chosenAllocation.id) {
        let actStartDate = new Date(activities[i].startDate);
        let actEndDate = new Date(activities[i].endDate);

        if (
          (startDate <= actStartDate && endDate >= actStartDate) ||
          (startDate <= actEndDate && endDate >= actEndDate) ||
          (startDate <= actStartDate && endDate >= actEndDate) ||
          (startDate >= actStartDate && endDate <= actEndDate)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  render() {
    const { allocationChosed } = this.state;

    return (
      <Modal
        basic
        closeOnEscape={false}
        closeOnDimmerClick={false}
        trigger={
          <Button
            floated="right"
            icon
            labelPosition="left"
            primary
            size="small"
            onClick={this.loadProjectWithAllocations}
          >
            <Icon name="file alternate" /> {activityStrings.addActivity}
          </Button>
        }
        closeIcon
      >
        {!allocationChosed && this.chooseAllocationModalContent()}
        {allocationChosed && this.addActivityModalContent()}
      </Modal>
    );
  }

  chooseAllocationModalContent() {
    const { allocations } = this.state;

    return (
      <React.Fragment>
        <Modal.Header>{activityStrings.chooseResource}</Modal.Header>
        <Modal.Content>
          <Table striped selectable>
            <Table.Header>
              <Table.Row textAlign="center">
                <Table.HeaderCell>{systemStrings.name}</Table.HeaderCell>
                <Table.HeaderCell>
                  {systemStrings.allocation_percent_sign}
                </Table.HeaderCell>
                <Table.HeaderCell>{systemStrings.cost}</Table.HeaderCell>
                <Table.HeaderCell>{systemStrings.startDate}</Table.HeaderCell>
                <Table.HeaderCell>{systemStrings.endDate}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {allocations.map((allocation) => {
                return (
                  <Table.Row
                    onClick={() => this.chooseAllocation(allocation)}
                    key={allocation.id}
                    textAlign="center"
                  >
                    <Table.Cell>{allocation.user.name}</Table.Cell>
                    <Table.Cell>
                      {Math.ceil(allocation.allocationPercentage) + "%"}
                    </Table.Cell>
                    <Table.Cell>{allocation.costPerHour + "€"}</Table.Cell>
                    <Table.Cell>
                      {new Date(allocation.startDate).toLocaleDateString(
                        localStorage.getItem("language")
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(allocation.endDate).toLocaleDateString(
                        localStorage.getItem("language")
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Modal.Content>
      </React.Fragment>
    );
  }

  addActivityModalContent() {
    const {
      chosenAllocation,
      activityName,
      description,
      startDate,
      hoursLeft,
      endDate,
      addPrecedents,
      success,
      error,
    } = this.state;

    const { selectedProject } = this.props;

    return (
      <React.Fragment>
        <Icon
          name="arrow left"
          onClick={() => this.setState({ allocationChosed: false })}
        />
        <Modal.Header>{activityStrings.addActivity}</Modal.Header>
        <Table>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell>{systemStrings.name}</Table.HeaderCell>
              <Table.HeaderCell>
                {systemStrings.allocation_percent_sign}
              </Table.HeaderCell>
              <Table.HeaderCell>{systemStrings.cost}</Table.HeaderCell>
              <Table.HeaderCell>{systemStrings.startDate}</Table.HeaderCell>
              <Table.HeaderCell>{systemStrings.endDate}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row
              textAlign="center"
              error={!this.checkAllocationAvailability()}
            >
              <Table.Cell>{chosenAllocation.user.name}</Table.Cell>
              <Table.Cell>
                {Math.ceil(chosenAllocation.allocationPercentage) + "%"}
              </Table.Cell>
              <Table.Cell>{chosenAllocation.costPerHour + "€"}</Table.Cell>
              <Table.Cell>
                {new Date(chosenAllocation.startDate).toLocaleDateString(
                  localStorage.getItem("language")
                )}
              </Table.Cell>
              <Table.Cell>
                {new Date(chosenAllocation.endDate).toLocaleDateString(
                  localStorage.getItem("language")
                )}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Modal.Content>
          <Form onSubmit={this.createActivity}>
            <Segment basic>
              <Grid textAlign="center" stackable>
                <Grid.Row columns="2">
                  <Grid.Column>
                    <Header inverted as="h4">
                      {systemStrings.name}
                    </Header>
                    <Form.Input
                      name="activityName"
                      icon="clipboard"
                      iconPosition="left"
                      placeholder={activityStrings.activityName}
                      onChange={this.handleChange}
                      value={activityName}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h4">
                      {activityStrings.activityType}
                    </Header>
                    <Dropdown
                      selection
                      options={activityType()}
                      defaultValue={activityType()[0].value}
                      onChange={this.handleTypeChange}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Input
                      name="description"
                      icon="file text"
                      iconPosition="left"
                      size="large"
                      type="text"
                      placeholder={projectStrings.description}
                      onChange={this.handleChange}
                      value={description}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns="3">
                  <Grid.Column>
                    <Header inverted as="h4">
                      {systemStrings.startDate}
                    </Header>
                    <Input
                      type="date"
                      name="startDate"
                      value={startDate.toISOString().substr(0, 10)}
                      onChange={this.handleStartDateChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h4">
                      {activityStrings.estimatedHours}
                    </Header>
                    <Label size="big">{hoursLeft}</Label>
                  </Grid.Column>
                  <Grid.Column>
                    <Header inverted as="h4">
                      {systemStrings.endDate}
                    </Header>
                    <Input
                      type="date"
                      name="endDate"
                      value={endDate.toISOString().substr(0, 10)}
                      onChange={this.handleEndDateChange}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Label size="large">
                    <Checkbox
                      name="addPrecedents"
                      onChange={() =>
                        this.setState({
                          addPrecedents: !addPrecedents,
                        })
                      }
                      checked={addPrecedents}
                      type="checkbox"
                      label={activityStrings.addPrecedents + "?"}
                    />
                  </Label>
                </Grid.Row>
                {addPrecedents && (
                  <Table>
                    <Table.Header>
                      <Table.Row textAlign="center">
                        <Table.HeaderCell>
                          {systemStrings.name}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          {projectStrings.description}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          {systemStrings.startDate}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          {systemStrings.endDate}
                        </Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {selectedProject.activities.map((activity) => {
                        if (startDate > new Date(activity.endDate)) {
                          return (
                            <Table.Row key={activity.id} textAlign="center">
                              <Table.Cell>{activity.name}</Table.Cell>
                              <Table.Cell>{activity.description}</Table.Cell>
                              <Table.Cell>
                                {new Date(
                                  activity.startDate
                                ).toLocaleDateString(
                                  localStorage.getItem("language")
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                {new Date(activity.endDate).toLocaleDateString(
                                  localStorage.getItem("language")
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                <Checkbox
                                  value={activity.id}
                                  onChange={this.addPrecedents}
                                />
                              </Table.Cell>
                            </Table.Row>
                          );
                        }
                      })}
                    </Table.Body>
                  </Table>
                )}
                <Grid.Row>
                  <Button
                    disabled={!this.isFormValid()}
                    color="teal"
                    fluid
                    size="medium"
                  >
                    {activityStrings.addActivity}
                  </Button>
                </Grid.Row>
              </Grid>
            </Segment>
          </Form>
          {success.length > 0 && (
            <Message success>
              <h3>{systemStrings.success}</h3>
              {success}
            </Message>
          )}
          {error.length > 0 && (
            <Message error>
              <h3>{systemStrings.error}</h3>
              {error}
            </Message>
          )}
        </Modal.Content>
      </React.Fragment>
    );
  }
}

export default AddActivity;
