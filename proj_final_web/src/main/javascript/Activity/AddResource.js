import React from "react";
import { Button, Icon } from "semantic-ui-react";

import { usersAPI, allocationsAPI } from "../util/APIs";
import { getData, postData, requestHeaders } from "../util/Functions";
import AddProjectResources from "../Project/AddProjectResources";
import {
  userStrings,
  systemStrings,
} from "../Localization/TranslationLanguages";

class AddResource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      error: "",
      success: "",
      showAddResourcesModal: false,
      projStartDate: new Date(props.selectedProject.startDate),
      projEndDate: new Date(props.selectedProject.endDate),
    };
    this.handleFetchAvailableUsers = this.handleFetchAvailableUsers.bind(this);
    this.handleShowAddResourcesModal = this.handleShowAddResourcesModal.bind(
      this
    );
    this.updateUserList = this.updateUserList.bind(this);
    this.createResources = this.createResources.bind(this);
  }

  componentDidMount() {
    this.handleFetchAvailableUsers();
  }

  handleFetchAvailableUsers() {
    getData(
      usersAPI + "/" + this.props.selectedProject.id + "/available",
      requestHeaders()
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          this.setState({ users: data });
        });
      }
    });
  }

  updateUserList(users) {
    this.setState({
      users,
    });
  }

  handleShowAddResourcesModal() {
    this.state.showAddResourcesModal
      ? this.setState(
          {
            showAddResourcesModal: false,
            success: "",
          },
          () => this.handleFetchAvailableUsers()
        )
      : this.setState({
          showAddResourcesModal: true,
        });
  }

  createResources(allocations) {
    postData(
      allocationsAPI,
      requestHeaders(),
      this.buildJsonAllocations(allocations)
    ).then((response) => {
      if (response.status == 201) {
        response.json().then((data) => {
          this.setState({
            success: userStrings.resourcesAllocated,
          });
          this.props.setResource(data);
        });
      } else if (response.status == 401) {
        this.setState({
          error: systemStrings.noPermission,
        });
      } else {
        this.setState({
          error: systemStrings.somethingWentWrong,
        });
      }
    });
  }

  buildJsonAllocations(allocations) {
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
        projectId: localStorage.getItem("selectedProject"),
      });
    }
    return bodyJSON;
  }

  render() {
    const {
      projStartDate,
      projEndDate,
      users,
      showAddResourcesModal,
      error,
      success,
    } = this.state;

    return (
      <React.Fragment>
        <Button
          floated="right"
          icon
          labelPosition="left"
          primary
          size="small"
          onClick={this.handleShowAddResourcesModal}
        >
          <Icon name="file alternate" /> {userStrings.addResource}
        </Button>
        <AddProjectResources
          users={users}
          open={showAddResourcesModal}
          close={this.handleShowAddResourcesModal}
          projStartDate={projStartDate}
          projEndDate={projEndDate}
          error={error}
          success={success}
          updateUserList={this.updateUserList}
          createResources={this.createResources}
        />
      </React.Fragment>
    );
  }
}

export default AddResource;
