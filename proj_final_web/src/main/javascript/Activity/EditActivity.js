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
  Table,
  Header,
  Checkbox,
  Label,
} from "semantic-ui-react";

import { projectsAPI } from "../util/APIs";
import { putData, requestHeaders } from "../util/Functions";
import { activityType } from "../util/Constants";

import {
  systemStrings,
  activityStrings,
} from "../Localization/TranslationLanguages";

export default class EditActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenAllocation: {},
      activityName: "",
      description: "",
      type: activityType()[this.activityTypeIndex()].value,
      startDate: new Date(this.props.activity.startDate),
      endDate: new Date(this.props.activity.endDate),
      hoursLeft: 0,
      precedents: [],
      changeAllocation: false,
      error: "",
      success: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.setActivity = this.setActivity.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handlePrecedents = this.handlePrecedents.bind(this);
    this.cleanPrecedents = this.cleanPrecedents.bind(this);
    this.editActivity = this.editActivity.bind(this);
  }

  editActivity() {
    putData(
      projectsAPI
        .concat("/")
        .concat(this.props.selectedProject.id)
        .concat("/activity/edit"),
      requestHeaders(),
      this.buildActivity()
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          this.setState(
            {
              success: activityStrings.activityEdited,
            },
            this.props.updateActivity(data)
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
      id: this.props.activity.id,
      name: this.state.activityName,
      description: this.state.description,
      type: this.state.type,
      startDate: this.state.startDate.toISOString(),
      endDate: this.state.endDate.toISOString(),
      hoursLeft: this.state.hoursLeft,
      allocationId: this.state.chosenAllocation.id,
      precedentsId: this.getPrecedentsId(),
    };
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
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

    this.areDatesValid(startDate, this.state.endDate);
  }

  handleEndDateChange(e) {
    e.preventDefault();
    let endDate = new Date(e.target.value);

    this.areDatesValid(this.state.startDate, endDate);
  }

  areDatesValid(startDate, endDate) {
    if (
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

    this.setState({ hoursLeft: Math.ceil(businessDays * dailyHours) }, () =>
      this.cleanPrecedents(new Date(this.state.startDate.getTime()))
    );
  }

  setActivity() {
    const { activity } = this.props;

    this.setState({
      id: activity.id,
      activityName: activity.name,
      description: activity.description,
      hoursLeft: activity.hoursLeft,
      precedents: activity.precedents,
      chosenAllocation: activity.allocation,
      type: activityType()[this.activityTypeIndex()].value,
      startDate: new Date(this.props.activity.startDate),
      endDate: new Date(this.props.activity.endDate),
      changeAllocation: false,
      success: "",
      error: "",
    });
  }

  getPrecedentsId() {
    let precedentsId = [];

    for (let i = 0; i < this.state.precedents.length; i++) {
      precedentsId.push(this.state.precedents[i].id.toString());
    }

    return precedentsId;
  }

  activityTypeIndex() {
    for (let i = 0; i < activityType().length; i++) {
      if (activityType()[i].value === this.props.activity.type) {
        return i;
      }
    }
    return 0;
  }

  allocationChoosedActiveRow(allocation) {
    return allocation.id === this.state.chosenAllocation.id;
  }

  handlePrecedents(e, { checked, value }) {
    e.preventDefault();

    let activity = this.props.selectedProject.activities.find((activity) => {
      return activity.id === value;
    });

    let precedents = [...this.state.precedents];

    if (checked) {
      precedents.push(activity);
    } else {
      for (let i = 0; i < precedents.length; i++) {
        if (precedents[i].id == activity.id) {
          precedents.splice(i, 1);
        }
      }
    }
    this.setState({ precedents });
  }

  isPrecedent(activity) {
    for (let i = 0; i < this.state.precedents.length; i++) {
      if (this.state.precedents[i].id == activity.id) {
        return true;
      }
    }
    return false;
  }

  cleanPrecedents(startDate) {
    let precedents = [...this.state.precedents];

    let idsToRemove = [];
    for (let i = 0; i < precedents.length; i++) {
      if (startDate <= new Date(precedents[i].endDate)) {
        idsToRemove.push(precedents[i].id);
      }
    }

    for (let i = 0; i < idsToRemove.length; i++) {
      for (let j = 0; j < precedents.length; j++) {
        if (idsToRemove[i] === precedents[j].id) {
          precedents.splice(j, 1);
        }
      }
    }
    this.setState({ precedents });
  }

  checkAllocationAvailability() {
    let activities = [...this.props.selectedProject.activities];

    const { chosenAllocation, startDate, endDate } = this.state;

    for (let i = 0; i < activities.length; i++) {
      if (
        activities[i].allocation.id === chosenAllocation.id &&
        activities[i].id != this.props.activity.id
      ) {
        if (
          (startDate <= new Date(activities[i].startDate) &&
            endDate >= new Date(activities[i].startDate)) ||
          (startDate <= new Date(activities[i].endDate) &&
            endDate >= new Date(activities[i].endDate)) ||
          (startDate <= new Date(activities[i].startDate) &&
            endDate >= new Date(activities[i].endDate)) ||
          (startDate >= new Date(activities[i].startDate) &&
            endDate <= new Date(activities[i].endDate))
        ) {
          return false;
        }
      }
    }
    return true;
  }

  disableButton() {
    if (!this.checkAllocationAvailability() || this.state.error.length > 0) {
      return true;
    }
    return false;
  }

  render() {
    const {
      id,
      chosenAllocation,
      changeAllocation,
      activityName,
      description,
      startDate,
      endDate,
      error,
      success,
    } = this.state;

    const { activity, selectedProject } = this.props;

    return (
      <React.Fragment>
        <Modal
          basic
          closeOnEscape={false}
          closeOnDimmerClick={false}
          trigger={<Icon name="edit" onClick={this.setActivity} />}
          closeIcon
        >
          <Modal.Header>{activityStrings.editActivity}</Modal.Header>

          {chosenAllocation.id > -1 && (
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
          )}
          <Label size="large">
            <Checkbox
              name="changeAllocation"
              onChange={() =>
                this.setState({
                  changeAllocation: !changeAllocation,
                })
              }
              checked={changeAllocation}
              type="checkbox"
              label={activityStrings.changeAllocation}
              disabled={activity.hoursSpend > 0}
            />
          </Label>

          {changeAllocation && (
            <Table selectable striped>
              <Table.Body>
                {selectedProject.allocations.map((allocation) => {
                  if (allocation.id != chosenAllocation.id) {
                    return (
                      <Table.Row
                        onClick={() =>
                          this.setState(
                            {
                              chosenAllocation: allocation,
                            },
                            () => this.calcHoursLeft()
                          )
                        }
                        key={allocation.id}
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
                  }
                })}
              </Table.Body>
            </Table>
          )}
          <Modal.Content>
            <Form onSubmit={this.editActivity}>
              <Segment basic>
                <Grid textAlign="center" stackable>
                  <Grid.Row columns="2">
                    <Grid.Column>
                      <Header inverted as="h4">
                        {systemStrings.name}
                      </Header>
                      <Form.Input
                        name="activityName"
                        size="large"
                        icon="user"
                        iconPosition="left"
                        type="text"
                        value={activityName}
                        onChange={this.handleChange}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Header inverted as="h4">
                        {activityStrings.activityType}
                      </Header>
                      <Dropdown
                        selection
                        options={activityType()}
                        defaultValue={
                          activityType()[this.activityTypeIndex()].value
                        }
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
                        value={description}
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
                        value={startDate.toISOString().substr(0, 10)}
                        onChange={this.handleStartDateChange}
                        disabled={activity.hoursSpend > 0}
                      />
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
                    <Grid.Column>
                      <Header inverted as="h3">
                        {activityStrings.precedents}
                      </Header>
                      <Table>
                        <Table.Body>
                          {selectedProject.activities.map((activity) => {
                            if (
                              startDate > new Date(activity.endDate) &&
                              activity.id != id
                            ) {
                              return (
                                <Table.Row key={activity.id}>
                                  <Table.Cell>{activity.name}</Table.Cell>
                                  <Table.Cell>
                                    {activity.description}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {new Date(
                                      activity.startDate
                                    ).toLocaleDateString(
                                      localStorage.getItem("language")
                                    )}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {new Date(
                                      activity.endDate
                                    ).toLocaleDateString(
                                      localStorage.getItem("language")
                                    )}
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Checkbox
                                      checked={this.isPrecedent(activity)}
                                      value={activity.id}
                                      onChange={this.handlePrecedents}
                                    />
                                  </Table.Cell>
                                </Table.Row>
                              );
                            }
                          })}
                        </Table.Body>
                      </Table>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Button
                      disabled={this.disableButton()}
                      color="teal"
                      fluid
                      size="medium"
                    >
                      {activityStrings.editActivity}
                    </Button>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Form>
            {error.length > 0 && (
              <Message error>
                <h3>{systemStrings.error}</h3>
                {error}
              </Message>
            )}
            {success.length > 0 && (
              <Message success>
                <h3>{systemStrings.success}</h3>
                {success}
              </Message>
            )}
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}
