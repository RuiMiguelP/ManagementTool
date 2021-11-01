import React from "react";
import {
  Table,
  Label,
  Divider,
  Icon,
  Modal,
  Button,
  Form,
  Input,
  List,
  Checkbox,
  Grid,
} from "semantic-ui-react";
import { putData, getData, requestHeaders } from "../util/Functions";
import { usersAPI } from "../util/APIs";
import FiltersRoles from "./FiltersRoles";
import {
  userStrings,
  systemStrings,
} from "../Localization/TranslationLanguages";

class ManageRoles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.getItem("email"),
      token: localStorage.getItem("token"),
      globalUsers: [],
      backupData: [],
      modalEdit: false,
      modalActivation: false,
      modalInactivation: false,
      selectedUser: null,
      editUser: {},
      isAdmin: false,
      isDirector: false,
      isUser: false,
      isVisitor: false,
      occupation: "",
      emailSearch: "",
      isAdminSearch: false,
      isDirectorSearch: false,
      isUserSearch: false,
      isVisitorSearch: false,
    };
    this.openModalEdit = this.openModalEdit.bind(this);
    this.closeModalEdit = this.closeModalEdit.bind(this);
    this.openModalActivation = this.openModalActivation.bind(this);
    this.closeModalActivation = this.closeModalActivation.bind(this);
    this.openModalInactivation = this.openModalInactivation.bind(this);
    this.closeModalInactivation = this.closeModalInactivation.bind(this);
    this.changeStateActive = this.changeStateActive.bind(this);
    this.changeUserInfo = this.changeUserInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleAdmin = this.toggleAdmin.bind(this);
    this.toggleDirector = this.toggleDirector.bind(this);
    this.toggleUser = this.toggleUser.bind(this);
    this.toggleVisitor = this.toggleVisitor.bind(this);
    this.buildNewUserInfo = this.buildNewUserInfo.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.loadRoleUsers = this.loadRoleUsers.bind(this);
  }

  componentDidMount() {
    this.loadRoleUsers();
  }

  loadRoleUsers() {
    getData(usersAPI, requestHeaders()).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          var index = null;
          for (var i = 0; i < data.length; i++) {
            if (data[i].id == this.props.uid) {
              index = i;
            }
          }
          data.splice(index, 1);

          this.setState({
            globalUsers: data,
            backupData: data,
          });
        });
      } else {
        this.setState({
          globalUsers: [],
        });
        throw new Error(response.status + " : " + data.msg);
      }
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      error: "",
    });
  }

  openModalEdit(globalUser) {
    this.setState({
      modalEdit: true,
      selectedUser: globalUser.id,
      editUser: globalUser,
      isAdmin: globalUser.admin,
      isDirector: globalUser.director,
      isUser: globalUser.user,
      isVisitor: globalUser.visitor,
      occupation: globalUser.occupation,
    });
  }

  closeModalEdit() {
    this.setState({ modalEdit: false });
  }

  changeUserInfo(e) {
    e.preventDefault();

    putData(
      usersAPI + "/" + this.state.selectedUser + "/edit",
      requestHeaders(),
      this.buildNewUserInfo()
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          this.loadRoleUsers();
          this.setState({ modalEdit: false });
        });
      } else {
        console.error("Change User Info > " + response.status);
      }
    });
  }

  buildNewUserInfo() {
    return {
      occupation: this.state.occupation,
      admin: this.state.isAdmin,
      director: this.state.isDirector,
      user: this.state.isUser,
      visitor: this.state.isVisitor,
    };
  }

  openModalActivation(user) {
    this.setState({ modalActivation: true, selectedUser: user });
  }

  closeModalActivation() {
    this.setState({ modalActivation: false });
  }

  openModalInactivation(user) {
    this.setState({ modalInactivation: true, selectedUser: user });
  }

  closeModalInactivation() {
    this.setState({ modalInactivation: false });
  }

  changeStateActive(status) {
    putData(
      usersAPI + "/" + this.state.selectedUser + "?active=" + status,
      requestHeaders(),
      ""
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          if (status) {
            this.loadRoleUsers();
            this.setState({ modalActivation: false });
          } else {
            this.loadRoleUsers();
            this.setState({ modalInactivation: false });
          }
        });
      } else {
        console.error("Change State Active > " + response.status);
      }
    });
  }

  toggleAdmin(e, { checked }) {
    this.setState({ isAdmin: checked, isVisitor: false });
  }

  toggleDirector(e, { checked }) {
    this.setState({
      isDirector: checked,
      isVisitor: false,
    });
  }

  toggleUser(e, { checked }) {
    this.setState({ isUser: checked, isVisitor: false });
  }

  toggleVisitor(e, { checked }) {
    this.setState({
      isVisitor: checked,
      isAdmin: false,
      isDirector: false,
      isUser: false,
    });
  }

  handleFilterChange({
    emailSearch,
    isAdminSearch,
    isDirectorSearch,
    isUserSearch,
    isVisitorSearch,
  }) {
    this.setState(
      {
        emailSearch,
        isAdminSearch,
        isDirectorSearch,
        isUserSearch,
        isVisitorSearch,
      },
      this.updateUsersList
    );
  }

  updateUsersList() {
    const {
      isAdminSearch,
      isDirectorSearch,
      isUserSearch,
      isVisitorSearch,
      emailSearch,
      backupData,
    } = this.state;
    var filteredUsers = backupData.filter(
      function (filterUser) {
        if (
          emailSearch == "" &&
          !isAdminSearch &&
          !isDirectorSearch &&
          !isUserSearch &&
          !isVisitorSearch
        ) {
          return backupData;
        } else {
          if (
            (filterUser.admin === isAdminSearch && isAdminSearch) ||
            (filterUser.director === isDirectorSearch && isDirectorSearch) ||
            (filterUser.visitor === isVisitorSearch && isVisitorSearch) ||
            (filterUser.user === isUserSearch && isUserSearch) ||
            (!isAdminSearch &&
              !isDirectorSearch &&
              !isUserSearch &&
              !isVisitorSearch)
          ) {
            return (
              filterUser.email
                .toLowerCase()
                .indexOf(emailSearch.toLowerCase()) !== -1
            );
          }
        }
      }.bind(this)
    );

    this.setState({
      globalUsers: filteredUsers,
    });
  }

  render() {
    return (
      <React.Fragment>
        <Grid columns="equal" className="app" stackable>
          <Grid.Column className="panel_manage_users">
            <Label>{userStrings.manageRoles}</Label>
            <Divider />
            <FiltersRoles onFilterChange={this.handleFilterChange} />
            <Divider />
            {/* Table */}
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
                  <Table.HeaderCell>{systemStrings.email}</Table.HeaderCell>
                  <Table.HeaderCell>
                    {systemStrings.occupation}
                  </Table.HeaderCell>
                  <Table.HeaderCell>{userStrings.status}</Table.HeaderCell>
                  <Table.HeaderCell>{userStrings.admin}</Table.HeaderCell>
                  <Table.HeaderCell>{userStrings.director}</Table.HeaderCell>
                  <Table.HeaderCell>{userStrings.user}</Table.HeaderCell>
                  <Table.HeaderCell>{userStrings.visitor}</Table.HeaderCell>
                  <Table.HeaderCell>{systemStrings.action}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {this.state.globalUsers.map((globalUser) => (
                  <Table.Row key={globalUser.id}>
                    <Table.Cell>{globalUser.name}</Table.Cell>
                    <Table.Cell>{globalUser.email}</Table.Cell>
                    <Table.Cell>{globalUser.occupation}</Table.Cell>
                    <Table.Cell>
                      {globalUser.id != localStorage.getItem("uid") &&
                        globalUser.availableBeInactive && (
                          <React.Fragment>
                            {globalUser.active ? (
                              <Button
                                color="red"
                                onClick={() =>
                                  this.openModalInactivation(globalUser.id)
                                }
                              >
                                {systemStrings.inactive}
                              </Button>
                            ) : (
                              <Button
                                color="green"
                                onClick={() =>
                                  this.openModalActivation(globalUser.id)
                                }
                              >
                                {systemStrings.active}
                              </Button>
                            )}
                          </React.Fragment>
                        )}
                    </Table.Cell>
                    <Table.Cell>
                      {globalUser.admin ? (
                        <Icon color="green" name="checkmark" size="large" />
                      ) : (
                        ""
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {globalUser.director ? (
                        <Icon color="green" name="checkmark" size="large" />
                      ) : (
                        ""
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {globalUser.user ? (
                        <Icon color="green" name="checkmark" size="large" />
                      ) : (
                        ""
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {globalUser.visitor ? (
                        <Icon color="green" name="checkmark" size="large" />
                      ) : (
                        ""
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {globalUser.id != localStorage.getItem("uid") && (
                        <Icon
                          name="edit"
                          size="large"
                          onClick={() => this.openModalEdit(globalUser)}
                        />
                      )}{" "}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            {/* Modal Activation */}
            <Modal
              basic
              open={this.state.modalActivation}
              onClose={this.closeModalActivation}
            >
              <Modal.Header>{userStrings.userActivation}</Modal.Header>
              <Modal.Content>
                {userStrings.confirmActivateAccount}
              </Modal.Content>
              <Modal.Actions>
                <Button
                  color="green"
                  inverted
                  onClick={() => this.changeStateActive(true)}
                >
                  <Icon name="checkmark" /> {systemStrings.confirm}
                </Button>
                <Button
                  color="red"
                  inverted
                  onClick={this.closeModalActivation}
                >
                  <Icon name="remove" /> {systemStrings.cancel}
                </Button>
              </Modal.Actions>
            </Modal>
            {/* Modal Inactivation */}
            <Modal
              basic
              open={this.state.modalInactivation}
              onClose={this.closeModalInactivation}
            >
              <Modal.Header>{userStrings.userInactivation}</Modal.Header>
              <Modal.Content>
                {userStrings.confirmInactivateAccount}
              </Modal.Content>
              <Modal.Actions>
                <Button
                  color="green"
                  inverted
                  onClick={() => this.changeStateActive(false)}
                >
                  <Icon name="checkmark" /> {systemStrings.confirm}
                </Button>
                <Button
                  color="red"
                  inverted
                  onClick={this.closeModalInactivation}
                >
                  <Icon name="remove" /> {systemStrings.cancel}
                </Button>
              </Modal.Actions>
            </Modal>
            {/* Modal Edit User */}
            <Modal
              basic
              open={this.state.modalEdit}
              onClose={this.closeModalEdit}
            >
              <Modal.Header>{userStrings.editUser}</Modal.Header>
              <Modal.Content>
                <Form onSubmit={this.handleEdit}>
                  <Form.Field>
                    <List horizontal divided selection>
                      <List.Item>
                        <Label horizontal size="large">
                          {userStrings.admin}
                          <Checkbox
                            name="isAdmin"
                            checked={this.state.isAdmin}
                            onChange={this.toggleAdmin}
                          />
                        </Label>
                      </List.Item>
                      <List.Item>
                        <Label horizontal size="large">
                          {userStrings.director}
                          <Checkbox
                            name="isDirector"
                            checked={this.state.isDirector}
                            onChange={this.toggleDirector}
                          />
                        </Label>
                      </List.Item>
                      <List.Item>
                        <Label horizontal size="large">
                          {userStrings.user}
                          <Checkbox
                            name="isUser"
                            checked={this.state.isUser}
                            onChange={this.toggleUser}
                          />
                        </Label>
                      </List.Item>
                      <List.Item>
                        <Label horizontal size="large">
                          {userStrings.visitor}
                          <Checkbox
                            name="isVisitor"
                            checked={this.state.isVisitor}
                            onChange={this.toggleVisitor}
                          />
                        </Label>
                      </List.Item>
                    </List>
                    <Input
                      type="text"
                      fluid
                      label={systemStrings.occupation}
                      name="occupation"
                      value={this.state.occupation}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button color="green" inverted onClick={this.changeUserInfo}>
                  <Icon name="checkmark" /> {systemStrings.confirm}
                </Button>
                <Button color="red" inverted onClick={this.closeModalEdit}>
                  <Icon name="remove" /> {systemStrings.cancel}
                </Button>
              </Modal.Actions>
            </Modal>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ManageRoles;
