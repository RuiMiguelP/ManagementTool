import React from "react";
import {
  Menu,
  Icon,
  Modal,
  Dropdown,
  Input,
  Checkbox,
  Label,
  Table,
  Pagination,
} from "semantic-ui-react";
import { projectsAPI } from "../util/APIs";
import { getData, requestHeaders } from "../util/Functions";
import { projectStateOptions } from "../util/Constants";
import {
  projectStrings,
  systemStrings,
} from "../Localization/TranslationLanguages";

export default class SearchProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selectedProjects: [],
      projectsToRender: [],
      search: "",
      searchByDate: false,
      searchOption: 1,
      projectState: "",
      date: new Date(),
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchOptionChange = this.handleSearchOptionChange.bind(this);
    this.handleProjectStateChange = this.handleProjectStateChange.bind(this);
    this.handleSearchByDate = this.handleSearchByDate.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getProjects = this.getProjects.bind(this);
    this.filter = this.filter.bind(this);
    this.handlePagChange = this.handlePagChange.bind(this);
    this.cleanState = this.cleanState.bind(this);
  }

  cleanState() {
    var date = new Date();
    date.setHours(1);
    this.setState({
      projects: [],
      selectedProjects: [],
      projectsToRender: [],
      search: "",
      searchByDate: false,
      searchOption: 1,
      projectState: "",
      date,
    });
  }

  filter() {
    let selectedProjects = [];

    switch (this.state.searchOption) {
      case 1: {
        selectedProjects = this.state.projects.filter((project) => {
          return (
            project.name
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
          );
        });
        break;
      }
      case 2: {
        selectedProjects = this.state.projects.filter((project) => {
          return (
            project.code
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
          );
        });
        break;
      }
      case 3: {
        selectedProjects = this.state.projects.filter((project) => {
          return (
            project.customerName
              .toLowerCase()
              .indexOf(this.state.search.toLowerCase()) !== -1
          );
        });
        break;
      }
    }
    if (this.state.projectState != "") {
      selectedProjects = selectedProjects.filter((project) => {
        return project.state === this.state.projectState;
      });
    }

    if (this.state.searchByDate) {
      selectedProjects = selectedProjects.filter((project) => {
        let startDate = new Date(project.startDate);
        let endDate = new Date(project.endDate);
        {
          return startDate <= this.state.date && endDate >= this.state.date;
        }
      });
    }
    this.setState({
      selectedProjects: selectedProjects,
      projectsToRender: selectedProjects.slice(0, 9),
    });
  }

  handleSearchChange(e, { value }) {
    e.preventDefault();

    this.setState(
      {
        search: value,
      },
      () => this.filter()
    );
  }

  handleSearchOptionChange(e, { value }) {
    e.preventDefault();
    this.setState(
      {
        searchOption: value,
      },
      () => this.filter()
    );
  }

  handleProjectStateChange(e, { value }) {
    e.preventDefault();
    this.setState(
      {
        projectState: value,
      },
      () => this.filter()
    );
  }

  handleSearchByDate() {
    this.setState(
      {
        searchByDate: !this.state.searchByDate,
      },
      () => this.filter()
    );
  }

  handleDateChange(e) {
    e.preventDefault();

    var date = new Date(e.target.value);
    date.setHours(1);

    this.setState(
      {
        date,
      },
      () => this.filter()
    );
  }

  getProjects() {
    getData(projectsAPI, requestHeaders())
      .then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            var date = new Date();
            date.setHours(1);

            this.setState({
              projects: data,
              selectedProjects: data,
              projectsToRender: data.slice(0, 9),
              date,
            });
          });
        } else {
          console.error("loadProjects > " + data);
        }
      })
      .catch((error) => {
        console.error("loadProjects > " + error);
      });
  }

  handlePagChange(e, { activePage }) {
    let selectedProjects = [...this.state.selectedProjects];

    this.setState({
      projectsToRender: selectedProjects.slice(
        activePage * 10 - 10,
        activePage * 10 - 1
      ),
    });
  }

  render() {
    return (
      <Modal
        closeOnDimmerClick={false}
        basic
        trigger={<Icon name="search" onClick={this.getProjects} />}
        closeIcon
        centered={false}
        onClose={this.cleanState}
      >
        <Modal.Header>{projectStrings.searchProject}</Modal.Header>
        <Modal.Content>
          <Menu secondary widths="2" stackable>
            <Menu.Item>
              <Dropdown
                options={searchOptions}
                defaultValue={searchOptions[0].value}
                selection
                onChange={this.handleSearchOptionChange}
              />
              <Dropdown
                placeholder={projectStrings.state}
                clearable
                options={projectStateOptions()}
                selection
                onChange={this.handleProjectStateChange}
              />
            </Menu.Item>
            <Menu.Item position="right">
              <Input
                name="search"
                icon="search"
                placeholder={systemStrings.search}
                onChange={this.handleSearchChange}
              />
            </Menu.Item>
          </Menu>
          <Label size="large">
            <Checkbox
              name="searchByDate"
              onChange={this.handleSearchByDate}
              type="checkbox"
              label={systemStrings.searchByDate}
            />
          </Label>
          {this.state.searchByDate && (
            <Input
              size="mini"
              type="date"
              name="date"
              onChange={this.handleDateChange}
              value={this.state.date.toISOString().substr(0, 10)}
            />
          )}
          {this.renderProjectTable()}
          {this.state.selectedProjects.length > 10 && (
            <Pagination
              defaultActivePage={1}
              totalPages={Math.ceil(this.state.selectedProjects.length / 10)}
              onPageChange={this.handlePagChange}
              firstItem={null}
              lastItem={null}
            />
          )}
        </Modal.Content>
      </Modal>
    );
  }

  renderProjectTable() {
    return (
      <Table striped>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>{systemStrings.name}</Table.HeaderCell>
            <Table.HeaderCell>{systemStrings.code}</Table.HeaderCell>
            <Table.HeaderCell singleLine>
              {projectStrings.clientName}
            </Table.HeaderCell>
            <Table.HeaderCell>{projectStrings.description}</Table.HeaderCell>
            <Table.HeaderCell>{projectStrings.state}</Table.HeaderCell>
            <Table.HeaderCell>{systemStrings.startDate}</Table.HeaderCell>
            <Table.HeaderCell>{systemStrings.endDate}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.projectsToRender.map((project) => {
            return (
              <Table.Row textAlign="center" key={project.id}>
                <Table.Cell>{project.name}</Table.Cell>
                <Table.Cell>{project.code}</Table.Cell>
                <Table.Cell>{project.customerName}</Table.Cell>
                <Table.Cell>{project.description}</Table.Cell>
                <Table.Cell>{this.getStateText(project.state)}</Table.Cell>
                <Table.Cell>
                  {new Date(project.startDate).toLocaleDateString(
                    localStorage.getItem("language")
                  )}
                </Table.Cell>
                <Table.Cell>
                  {new Date(project.endDate).toLocaleDateString(
                    localStorage.getItem("language")
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }

  getStateText(state) {
    let stateText = projectStateOptions().find((option) => {
      return option.value === state;
    });
    return stateText.text;
  }
}

export const searchOptions = [
  { key: 1, text: systemStrings.name, value: 1 },
  { key: 2, text: systemStrings.code, value: 2 },
  { key: 3, text: projectStrings.client, value: 3 },
];
