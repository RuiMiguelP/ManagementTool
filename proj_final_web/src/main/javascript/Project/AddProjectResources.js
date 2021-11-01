import React from "react";
import {
  Button,
  Form,
  Modal,
  Grid,
  Input,
  Search,
  Label,
  Icon,
  Popup,
  Message,
} from "semantic-ui-react";
import { integerRegExp, doubleRegExp } from "../util/Constants";
import { projectsAPI } from "../util/APIs";
import { postData, requestHeaders } from "../util/Functions";
import { systemStrings } from "../Localization/TranslationLanguages";

export default class AddProjectResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      selectedAllocations: [],
      value: "",
      allocation: "",
      costPerHour: "",
      maxAllocationChecked: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.renderSelectedAllocations = this.renderSelectedAllocations.bind(this);
    this.checkAvailability = this.checkAvailability.bind(this);
    this.buildAllocationList = this.buildAllocationList.bind(this);
    this.mapMaxPercentageAllocations = this.mapMaxPercentageAllocations.bind(
      this
    );
    this.clearStateOnClose = this.clearStateOnClose.bind(this);
  }

  clearStateOnClose() {
    this.setState(
      {
        searchResults: [],
        selectedAllocations: [],
        value: "",
        allocation: "",
        costPerHour: "",
        maxAllocationChecked: false,
      },
      () => this.props.close()
    );
  }

  buildAllocationList(allocations) {
    var bodyJSON = {
      allocationList: [],
    };

    for (var i in allocations) {
      var item = allocations[i];

      bodyJSON.allocationList.push({
        userId: item.user.id,
        startDate: item.startDate,
        endDate: item.endDate,
        costPerHour: item.cost,
        allocationPercentage: item.allocation,
      });
    }

    return bodyJSON;
  }

  checkAvailability() {
    postData(
      projectsAPI.concat("/").concat("allocations"),
      requestHeaders(),
      this.buildAllocationList(this.state.selectedAllocations)
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          this.mapMaxPercentageAllocations(data);
        });
      } else if (response.status == 401) {
        this.setState({
          error: "No permissions do this operation.",
        });
      } else {
        this.setState({
          error: "Something went wrong.",
        });
      }
    });
  }

  mapMaxPercentageAllocations(data) {
    var mapData = data;
    var selectedAllocations = [...this.state.selectedAllocations];

    Object.keys(mapData).forEach(function (key) {
      for (var j = 0; j < selectedAllocations.length; j++) {
        if (key == selectedAllocations[j].user.id) {
          selectedAllocations[j].maxAllocation = mapData[key];
        }
      }
    });

    this.setState({
      selectedAllocations,
    });
  }

  handleChange(e, allocation) {
    e.preventDefault();

    let allocations = [...this.state.selectedAllocations];

    for (let i = 0; i < allocations.length; i++) {
      if (allocation.user.id === allocations[i].user.id) {
        switch (e.target.name) {
          case "allocation":
            allocation.allocation = e.target.value;
            i = allocations.length;
            break;
          case "costPerHour":
            allocation.cost = e.target.value;
            i = allocations.length;
        }
      }
    }
    this.setState({
      selectedAllocations: allocations,
    });
  }

  handleSearchChange(e, { value }) {
    e.preventDefault();
    let filteredUsers = this.props.users.filter((user) => {
      if (user.occupation != null) {
        return (
          user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          user.occupation.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          user.email.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } else {
        return (
          user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
          user.email.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      }
    });

    this.setState({
      value: value,
      searchResults: this.usersToSearch(filteredUsers),
    });
  }

  usersToSearch(users) {
    let results = [];
    for (let i = 0; i < users.length; i++) {
      let result = {
        title: users[i].name,
        description: users[i].occupation,
        id: users[i].id,
      };
      results.push(result);
    }
    return results;
  }

  handleResultSelect(e, data) {
    e.preventDefault();
    let user = this.props.users.find((user) => {
      return user.id === data.result.id;
    });

    /*Tranform user in allocation and push to allocation list*/
    let selectedAllocations = [...this.state.selectedAllocations];

    let allocation = this.createAllocation(user);

    selectedAllocations.push(allocation);

    /*Update user list to not show user in search again*/
    let users = [...this.props.users];

    for (let i = 0; i < users.length; i++) {
      if (users[i].id === user.id) {
        users.splice(i, 1);
        i = users.length;
      }
    }

    this.setState(
      {
        selectedAllocations: selectedAllocations,
        value: "",
      },
      () => this.props.updateUserList(users)
    );
  }

  createAllocation(user) {
    return {
      user,
      startDate: new Date(this.props.projStartDate),
      endDate: new Date(this.props.projEndDate),
      maxAllocation: null,
      allocation: 0,
      cost: 0,
    };
  }

  removeFromSelectedAllocations(allocation) {
    let allocations = [...this.state.selectedAllocations];

    for (let i = 0; i < allocations.length; i++) {
      if (allocations[i].user.id === allocation.user.id) {
        allocations.splice(i, 1);
        break;
      }
    }

    let users = [...this.props.users];
    users.push(allocation.user);
    this.setState({ selectedAllocations: allocations }, () =>
      this.props.updateUserList(users)
    );
  }

  /*render methods*/

  renderSelectedAllocations() {
    return this.state.selectedAllocations.map((allocation) => (
      <Grid.Row stretched={true} key={allocation.user.id} columns="7">
        <Grid.Column>
          <Label>
            <Icon name="user" /> {allocation.user.name}
          </Label>
        </Grid.Column>
        <Grid.Column>
          <Label>{this.props.projStartDate.toISOString().substr(0, 10)}</Label>
        </Grid.Column>
        <Grid.Column>
          <Label>{this.props.projEndDate.toISOString().substr(0, 10)}</Label>
        </Grid.Column>
        <Grid.Column>
          <Label> {systemStrings.maxAllocation}</Label>
          {allocation.maxAllocation != null && (
            <Input
              name="max_allocation"
              icon="percent"
              type="text"
              placeholder={systemStrings.maxAllocation}
              disabled
              value={allocation.maxAllocation}
              style={{ opacity: 0.8 }}
            />
          )}
        </Grid.Column>
        {allocation.maxAllocation != null && (
          <Grid.Column>
            <Popup
              content={systemStrings.notValid}
              open={!this.isAllocationValid(allocation)}
              trigger={
                <Input
                  name="allocation"
                  icon="percent"
                  type="text"
                  placeholder={systemStrings.allocation}
                  onChange={(e) => this.handleChange(e, allocation)}
                />
              }
            />
          </Grid.Column>
        )}
        <Grid.Column>
          <Popup
            content={systemStrings.notValid}
            open={!this.isCostPerHourValid(allocation)}
            trigger={
              <Input
                name="costPerHour"
                icon="euro"
                type="text"
                placeholder={systemStrings.costPerHour}
                onChange={(e) => this.handleChange(e, allocation)}
              />
            }
          />
        </Grid.Column>
        <Grid.Column>
          <Icon
            fitted
            onClick={() => this.removeFromSelectedAllocations(allocation)}
            name="close"
          />
        </Grid.Column>
      </Grid.Row>
    ));
  }

  render() {
    return (
      <Modal
        size="large"
        basic
        open={this.props.open}
        onClose={this.clearStateOnClose}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        closeIcon
      >
        <Modal.Content>
          <Form>
            <Grid verticalAlign="middle" textAlign="center" stackable>
              <Grid.Row>
                <Search
                  loading={false}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={this.handleSearchChange}
                  results={this.state.searchResults}
                  noResultsMessage={systemStrings.noResultsFound}
                  placeholder={systemStrings.searchResults}
                  value={this.state.value}
                />
              </Grid.Row>
              {this.state.selectedAllocations.length > 0
                ? this.renderSelectedAllocations()
                : systemStrings.noUsersSelected}
              <Grid.Row>
                <Grid.Column>
                  <Button
                    onClick={() => this.checkAvailability()}
                    color="green"
                    disabled={!this.state.selectedAllocations.length > 0}
                  >
                    {systemStrings.checkMaxAllocationPercent}
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  {this.props.isCreateProject ? (
                    <Button
                      onClick={() =>
                        this.props.createProject(this.state.selectedAllocations)
                      }
                      size="large"
                      fluid
                      color="teal"
                      disabled={!this.checkAllocations()}
                    >
                      {systemStrings.addProject}
                    </Button>
                  ) : (
                    <React.Fragment>
                      {this.state.selectedAllocations.length > 0 && (
                        <Button
                          onClick={() =>
                            this.props.createResources(
                              this.state.selectedAllocations
                            )
                          }
                          size="large"
                          fluid
                          color="teal"
                          disabled={!this.checkAllocations()}
                        >
                          {systemStrings.addResources}
                        </Button>
                      )}
                    </React.Fragment>
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
          {this.props.success.length > 0 && (
            <Message success>
              <h3>{systemStrings.success}</h3>
              {this.props.success}
            </Message>
          )}
          {this.props.error.length > 0 && (
            <Message error>
              <h3>{systemStrings.error}</h3>
              {this.props.error}
            </Message>
          )}
        </Modal.Content>
      </Modal>
    );
  }

  /*
  Verification methods
  */
  checkAllocations() {
    let valid = true;
    for (let i = 0; i < this.state.selectedAllocations.length; i++) {
      if (
        !this.isAllocationValid(this.state.selectedAllocations[i]) ||
        !this.isCostPerHourValid(this.state.selectedAllocations[i]) ||
        this.state.selectedAllocations[i].allocation === 0 ||
        this.state.selectedAllocations[i].cost === 0 ||
        this.state.selectedAllocations[i].allocation === "" ||
        this.state.selectedAllocations[i].cost === ""
      ) {
        valid = false;
        i = this.state.selectedAllocations.length;
      }
    }
    if (valid && this.props.success.length > 0) {
      valid = false;
    }
    return valid;
  }

  isAllocationValid(allocation) {
    if (
      allocation.allocation > 100 ||
      integerRegExp.test(allocation.allocation) ||
      allocation.allocation > allocation.maxAllocation
    ) {
      return false;
    }

    return true;
  }

  isCostPerHourValid(allocation) {
    if (allocation.cost != 0 || allocation.cost != "") {
      return doubleRegExp.test(allocation.cost);
    }
    return true;
  }
}
