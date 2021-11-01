import React from "react";
import { Table, Grid, Label, Divider, Segment } from "semantic-ui-react";

import AddResource from "./AddResource";

import { localCostFormat } from "../util/Functions";

import {
  systemStrings,
  userStrings,
} from "../Localization/TranslationLanguages";

class ResourcePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  formatPercentage(percentage) {
    let percent = Number(percentage);

    if (percent % 1 == 0) {
      return parseInt(percent, 10) + "%";
    } else {
      return percentage + "%";
    }
  }

  render() {
    const { selectedProject, setResource } = this.props;

    return (
      <React.Fragment>
        <Grid columns="equal" className="app" stackable>
          <Grid.Column className="panel_manage_users">
            <Segment raised>
              <Label as="a" color="blue" ribbon>
                {userStrings.projectResources}
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
                      {userStrings.costPerHour}
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      {userStrings.allocation_percent_sign}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedProject.allocations &&
                    selectedProject.allocations.map((allocation) => (
                      <Table.Row key={allocation.id}>
                        <Table.Cell>{allocation.user.name}</Table.Cell>
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
                        <Table.Cell>
                          {localCostFormat(allocation.costPerHour) + "€"}
                        </Table.Cell>
                        <Table.Cell>
                          {this.formatPercentage(
                            allocation.allocationPercentage
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
                {selectedProject.allocations &&
                  JSON.parse(localStorage.getItem("isDirector")) && (
                    <Table.Footer fullWidth>
                      <Table.Row>
                        <Table.HeaderCell colSpan="5">
                          <AddResource
                            selectedProject={selectedProject}
                            setResource={setResource}
                          />
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Footer>
                  )}
              </Table>
            </Segment>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ResourcePanel;
