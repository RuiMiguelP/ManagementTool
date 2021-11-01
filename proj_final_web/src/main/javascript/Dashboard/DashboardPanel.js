import React from "react";
import { Grid } from "semantic-ui-react";
import AllocationsReport from "../Dashboard/AllocationsReport";
import IndicatorsReport from "../Dashboard/IndicatorsReport";

class DashboardPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        {this.props.wantsToGoAllocationsReport && (
          <AllocationsReport projects={this.props.projects} />
        )}
        {this.props.wantsToGoIndicatorsReport && (
          <IndicatorsReport projects={this.props.projects} />
        )}
      </React.Fragment>
    );
  }
}

export default DashboardPanel;
