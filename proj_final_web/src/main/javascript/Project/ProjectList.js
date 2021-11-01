import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import SearchProject from "./SearchProject";
import EditProject from "./EditProject";
import { systemStrings } from "../Localization/TranslationLanguages";

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false,
    };
    this.openModalEdit = this.openModalEdit.bind(this);
    this.closeModalEdit = this.closeModalEdit.bind(this);
  }

  openModalEdit() {
    this.setState({ modalEdit: true });
  }

  closeModalEdit() {
    this.setState({ modalEdit: false });
  }

  userCanEdit(project) {
    if (
      JSON.parse(localStorage.getItem("isDirector")) ||
      localStorage.getItem("email") === project.manager.email
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { project, selectedProject, setProject } = this.props;

    return (
      <React.Fragment>
        <Menu.Item
          style={{ opacity: 0.7 }}
          active={selectedProject === project.id}
          onClick={() => setProject(project.id)}
        >
          # {project.name}
          {this.userCanEdit(project) && (
            <EditProject
              replaceEditedProject={this.props.replaceEditedProject}
              project={project}
            />
          )}
        </Menu.Item>
      </React.Fragment>
    );
  }
}

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  componentDidMount() {
    this.props.goToMainPanel();
  }

  render() {
    const { projects, selectedProject, setProject } = this.props;

    return (
      <Menu.Menu style={{ paddingBottom: "2em" }} className="menu_sidebar">
        <Menu.Item>
          <span>
            <Icon name="fork" />
            {systemStrings.projects}
          </span>
          ({projects.length})
          <SearchProject />
        </Menu.Item>
        {projects.map((project) => (
          <Project
            key={project.id}
            project={project}
            selectedProject={selectedProject.id}
            setProject={setProject}
            replaceEditedProject={this.props.replaceEditedProject}
          />
        ))}
      </Menu.Menu>
    );
  }
}

export default ProjectList;
