import React from "react";
import {
  Table,
  Input,
  Progress,
  Grid,
  Label,
  Divider,
  Segment,
  Modal,
  Header,
  Icon,
} from "semantic-ui-react";
import AddActivity from "./AddActivity";
import UpdateActivity from "./UpdateActivity";
import EditActivity from "./EditActivity";
import ViewHistory from "./ViewHistory";

import {
  systemStrings,
  activityStrings,
  projectStrings,
} from "../Localization/TranslationLanguages";
import { projectStateOptions, activityType } from "../util/Constants";

class ActivityPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      error: "",
      isDirector: JSON.parse(localStorage.getItem("isDirector")),
      isManager: JSON.parse(localStorage.getItem("isManager")),
      uid: localStorage.getItem("uid"),
      activityPicked: false,
      activity: null,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleAddActivity = this.handleAddActivity.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkActivityOwner = this.checkActivityOwner.bind(this);
    this.viewActivity = this.viewActivity.bind(this);
    this.viewActivityModal = this.viewActivityModal.bind(this);
    this.closeModalView = this.closeModalView.bind(this);
  }

  viewActivity(activity) {
    this.setState({
      activityPicked: true,
      activity,
    });
  }

  closeModalView() {
    this.setState({ modal: false, activityPicked: false });
  }

  openModal() {
    this.setState({ modal: true });
  }

  closeModal() {
    this.setState({ modal: false });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleAddActivity(e) {
    e.preventDefault();
  }

  checkActivityOwner() {
    let activitiesOwner = [];
    if (
      Array.isArray(this.props.selectedProject.activities) &&
      this.props.selectedProject.activities.length
    ) {
      activitiesOwner = this.props.selectedProject.activities.filter(
        (activity) => {
          {
            return activity.allocation.user.id == this.state.uid;
          }
        }
      );
      if (Array.isArray(activitiesOwner) && activitiesOwner.length) {
        return true;
      } else {
        return false;
      }
    }
  }

  allowUpdate(activity) {
    let percent = activity.executionPercentage;
    let proj = this.props.selectedProject;

    if (
      percent < 100 &&
      (proj.state == projectStateOptions()[2].value ||
        proj.state == projectStateOptions()[3].value ||
        proj.state == projectStateOptions()[4].value)
    ) {
      for (let i = 0; i < activity.precedents.length; i++) {
        if (activity.precedents[i].executionPercentage < 100) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  activityTypeIndex(type) {
    for (let i = 0; i < activityType().length; i++) {
      if (activityType()[i].value === type) {
        return i;
      }
    }
    return 0;
  }

  render() {
    const { isDirector, isManager, uid, activityPicked } = this.state;

    const {
      selectedProject,
      updateActivity,
      activities,
      setActivity,
    } = this.props;
    return (
      <React.Fragment>
        <Grid columns="equal" className="app" stackable>
          <Grid.Column className="panel_manage_users">
            <Segment raised>
              <Label as="a" color="blue" ribbon>
                {activityStrings.projectActivities}
              </Label>
              <Divider />
              <Table
                celled
                inverted
                selectable
                textAlign="center"
                className="table_main_panel"
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>{systemStrings.name}</Table.HeaderCell>
                    <Table.HeaderCell>
                      {systemStrings.startDate}
                    </Table.HeaderCell>
                    <Table.HeaderCell>{systemStrings.endDate}</Table.HeaderCell>
                    <Table.HeaderCell>
                      {activityStrings.hoursSpend}
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      {activityStrings.hoursLeft}
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      {activityStrings.executionPercentage}
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      {systemStrings.resource}
                    </Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                    {isManager && <Table.HeaderCell></Table.HeaderCell>}
                    {this.checkActivityOwner() && (
                      <Table.HeaderCell></Table.HeaderCell>
                    )}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedProject.activities &&
                    selectedProject.activities.map((activity) => (
                      <Table.Row key={activity.id}>
                        <Table.Cell>{activity.name}</Table.Cell>
                        <Table.Cell>
                          {new Date(activity.startDate).toLocaleDateString(
                            localStorage.getItem("language")
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {new Date(activity.endDate).toLocaleDateString(
                            localStorage.getItem("language")
                          )}
                        </Table.Cell>
                        <Table.Cell>{activity.hoursSpend}</Table.Cell>
                        <Table.Cell>{activity.hoursLeft}</Table.Cell>
                        <Table.Cell>
                          <Progress
                            percent={activity.executionPercentage}
                            indicating
                            autoSuccess
                            progress
                            precision={2}
                            size="small"
                            style={{ margin: "0em" }}
                            inverted
                          />
                        </Table.Cell>
                        <Table.Cell>
                          {activity.allocation.user.email}
                        </Table.Cell>
                        <Table.Cell>
                          <Icon
                            onClick={() => this.viewActivity(activity)}
                            name="eye"
                          />
                        </Table.Cell>
                        {isManager && (
                          <Table.Cell>
                            <EditActivity
                              activity={activity}
                              selectedProject={selectedProject}
                              updateActivity={updateActivity}
                            />
                          </Table.Cell>
                        )}
                        {activity.allocation.user.id == uid &&
                          this.allowUpdate(activity) && (
                            <Table.Cell>
                              <UpdateActivity
                                activity={activity}
                                updateActivity={updateActivity}
                              />
                            </Table.Cell>
                          )}
                      </Table.Row>
                    ))}
                </Table.Body>
                {selectedProject.activities && (isDirector || isManager) && (
                  <Table.Footer fullWidth>
                    <Table.Row>
                      <Table.HeaderCell colSpan="10">
                        <AddActivity
                          activities={activities}
                          selectedProject={selectedProject}
                          setActivity={setActivity}
                        />
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Footer>
                )}
              </Table>
            </Segment>
          </Grid.Column>
        </Grid>
        {activityPicked && this.viewActivityModal()}
      </React.Fragment>
    );
  }

  viewActivityModal() {
    const { activityPicked, activity } = this.state;
    return (
      <React.Fragment>
        <Modal
          basic
          open={activityPicked}
          onClose={this.closeModalView}
          closeIcon
        >
          <Modal.Header>
            {activityStrings.viewActivity + "  "}
            <ViewHistory activity={activity} />
          </Modal.Header>
          <Modal.Content>
            <Segment basic>
              <Grid textAlign="center" stackable>
                <Grid.Row columns="2">
                  <Grid.Column>
                    <Input
                      label={systemStrings.name}
                      name="activityName"
                      type="text"
                      value={activity.name}
                      disabled
                      className="input_disabled"
                      fluid
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      label={systemStrings.type}
                      name="activityType"
                      type="text"
                      value={activity.type}
                      disabled
                      className="input_disabled"
                      fluid
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Input
                      label={projectStrings.description}
                      name="activityDescription"
                      type="text"
                      value={activity.description}
                      disabled
                      fluid
                      className="input_disabled"
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns="2">
                  <Grid.Column>
                    <Input
                      label={activityStrings.hoursLeft}
                      type="number"
                      name="remainingHours"
                      value={activity.hoursLeft}
                      disabled
                      className="input_disabled"
                      fluid
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      label={activityStrings.hoursSpend}
                      type="number"
                      name="hoursSpent"
                      value={activity.hoursSpend}
                      disabled
                      className="input_disabled"
                      fluid
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns="2">
                  <Grid.Column>
                    <Input
                      label={systemStrings.startDate}
                      type="text"
                      icon="calendar alternate outline"
                      name="startDate"
                      value={activity.startDate.substr(0, 10)}
                      disabled
                      className="input_disabled"
                      fluid
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      label={systemStrings.endDate}
                      type="text"
                      icon="calendar alternate outline"
                      name="endDate"
                      value={activity.endDate.substr(0, 10)}
                      disabled
                      className="input_disabled"
                      fluid
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns="2">
                  <Grid.Column>
                    <Input
                      label={systemStrings.resource}
                      type="text"
                      name="owner"
                      value={activity.allocation.user.name}
                      disabled
                      className="input_disabled"
                      fluid
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      label={systemStrings.resourceEmail}
                      type="text"
                      name="owner"
                      value={activity.allocation.user.email}
                      disabled
                      className="input_disabled"
                      fluid
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
                        {activity.precedents.map((precedent) => {
                          return (
                            <Table.Row key={precedent.id}>
                              <Table.Cell>{precedent.name}</Table.Cell>
                              <Table.Cell>{precedent.description}</Table.Cell>
                              <Table.Cell>
                                {new Date(
                                  precedent.startDate
                                ).toLocaleDateString(
                                  localStorage.getItem("language")
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                {new Date(precedent.endDate).toLocaleDateString(
                                  localStorage.getItem("language")
                                )}
                              </Table.Cell>
                            </Table.Row>
                          );
                        })}
                      </Table.Body>
                    </Table>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ActivityPanel;
