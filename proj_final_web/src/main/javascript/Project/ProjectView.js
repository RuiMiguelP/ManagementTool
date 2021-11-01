import React from "react";
import Chart from "react-google-charts";
import {
  Loader,
  Progress,
  Segment,
  Header,
  Table,
  Label,
} from "semantic-ui-react";
import { checkMobile, localCostFormat } from "../util/Functions";
import { projectStateOptions, typologyOptions } from "../util/Constants";
import ExportProject from "./ExportProject";

import {
  projectStrings,
  systemStrings,
  activityStrings,
} from "../Localization/TranslationLanguages";

class ProjectView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  projectToData() {
    if (this.props.selectedProject.id > -1) {
      let tasks = [...this.props.selectedProject.activities];
      let precedents = null;
      let data = [
        [
          { type: "string", label: projectStrings.taskID },
          { type: "string", label: projectStrings.taskName },
          { type: "date", label: systemStrings.startDate },
          { type: "date", label: systemStrings.endDate },
          { type: "number", label: projectStrings.duration },
          { type: "number", label: projectStrings.percentComplete },
          { type: "string", label: projectStrings.dependencies },
        ],
      ];

      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].precedents.length > 0) {
          precedents = "";
          for (let j = 0; j < tasks[i].precedents.length; j++) {
            precedents += tasks[i].precedents[j].id.toString();
            if (j < tasks[i].precedents.length - 1) {
              precedents += ",";
            }
          }
        } else {
          precedents = null;
        }

        data.push([
          tasks[i].id.toString(),
          tasks[i].name,
          new Date(tasks[i].startDate),
          new Date(tasks[i].endDate),
          null,
          tasks[i].executionPercentage,
          precedents,
        ]);
      }
      return data;
    }
  }

  projectProgress() {
    if (this.props.selectedProject.id > -1) {
      let totalPercentage = 0;

      for (let i = 0; i < this.props.selectedProject.activities.length; i++) {
        totalPercentage += this.props.selectedProject.activities[i]
          .executionPercentage;
      }

      return totalPercentage / this.props.selectedProject.activities.length;
    }
    return 0;
  }

  projectStateIndex() {
    for (let i = 0; i < projectStateOptions().length; i++) {
      if (projectStateOptions()[i].value === this.props.selectedProject.state) {
        return i;
      }
    }
    return 0;
  }
  projectTypologyIndex() {
    for (let i = 0; i < typologyOptions().length; i++) {
      if (typologyOptions()[i].value === this.props.selectedProject.typology) {
        return i;
      }
    }
    return 0;
  }

  render() {
    const { selectedProject } = this.props;

    return (
      <React.Fragment>
        {selectedProject.id > -1 && (
          <Segment basic textAlign="center">
            <Segment basic>
              <Header as={"h3"} textAlign="center">
                {projectStrings.projectProgress}
              </Header>
              <Progress
                percent={this.projectProgress()}
                indicating
                autoSuccess
                progress
                precision={0}
                size="large"
                style={{ margin: "0px" }}
              />
            </Segment>
            <Segment.Group horizontal={!checkMobile()}>
              <Segment basic>
                <Label size="large">
                  {systemStrings.startDate + ":"}
                  <Label size="large" style={{ color: "#787878" }}>
                    {new Date(selectedProject.startDate).toLocaleDateString(
                      localStorage.getItem("language")
                    )}
                  </Label>
                </Label>
              </Segment>
              <Segment basic>
                <Label size="large">
                  {projectStrings.budget + ":"}
                  <Label size="large" style={{ color: "#787878" }}>
                    {localCostFormat(selectedProject.budget) + "€"}
                  </Label>
                </Label>
              </Segment>
              <Segment basic>
                <Label size="large">
                  {projectStrings.state + ":"}
                  <Label size="large" style={{ color: "#787878" }}>
                    {projectStateOptions()[this.projectStateIndex()].text}
                  </Label>
                </Label>
              </Segment>
              <Segment basic>
                <Label size="large">
                  {projectStrings.typology + ":"}
                  <Label size="large" style={{ color: "#787878" }}>
                    {typologyOptions()[this.projectTypologyIndex()].text}
                  </Label>
                </Label>
              </Segment>
              <Segment basic>
                <Label size="large">
                  {systemStrings.endDate + ":"}
                  <Label size="large" style={{ color: "#787878" }}>
                    {new Date(selectedProject.endDate).toLocaleDateString(
                      localStorage.getItem("language")
                    )}
                  </Label>
                </Label>
              </Segment>
            </Segment.Group>
            {selectedProject.activities.length > 0 && (
              <React.Fragment>
                <Segment
                  style={{
                    height: 42 * (selectedProject.activities.length + 2),
                  }}
                  basic
                >
                  <Header as={"h3"} textAlign="center">
                    {projectStrings.ganttGraph}
                  </Header>
                  <Chart
                    chartType="Gantt"
                    loader={<Loader />}
                    data={this.projectToData()}
                    rootProps={{ "data-testid": "2" }}
                    options={{
                      height: 42 * (selectedProject.activities.length + 1),
                      gantt: {
                        labelStyle: {
                          fontName: "Lato",
                        },
                      },
                    }}
                  />
                </Segment>
                <Segment basic>
                  <Header as={"h3"} textAlign="center">
                    {projectStrings.projectActivities}
                  </Header>
                  <Table
                    celled
                    inverted
                    selectable
                    textAlign="center"
                    className="table_main_panel"
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>
                          {systemStrings.name}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          {systemStrings.startDate}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          {systemStrings.endDate}
                        </Table.HeaderCell>
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
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {selectedProject.activities.map((activity) => (
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
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Segment>
                <Segment basic>
                  <ExportProject project={selectedProject} />
                </Segment>
              </React.Fragment>
            )}
          </Segment>
        )}
      </React.Fragment>
    );
  }
}

export default ProjectView;
