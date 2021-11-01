import React from "react";
import {
  Label,
  Grid,
  Divider,
  Icon,
  Message,
  Statistic,
  Header,
  Accordion,
} from "semantic-ui-react";
import { getData, requestHeaders } from "../util/Functions";
import { projectsAPI } from "../util/APIs";
import {
  projectStrings,
  systemStrings,
} from "../Localization/TranslationLanguages";

class IndicatorsReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      projects: props.projects,
      stats: [],
      isDirector: JSON.parse(localStorage.getItem("isDirector")),
      isManager: JSON.parse(localStorage.getItem("isManager")),
      uid: localStorage.getItem("uid"),
    };
    this.setActiveIndex = this.setActiveIndex.bind(this);
    this.filterDataManager = this.filterDataManager.bind(this);
    this.writeMessage = this.writeMessage.bind(this);
  }

  componentDidMount() {
    this.loadIndicators();
  }

  checkProjectManager() {
    let activitiesOwner = [];
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

  loadIndicators() {
    getData(projectsAPI.concat("/stats"), requestHeaders())
      .then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            this.setState(
              {
                stats: data,
              },
              () => this.filterDataManager()
            );
          });
        } else {
          console.error("loadIndicators > " + data);
        }
      })
      .catch((error) => {
        console.error("loadIndicators > " + error);
      });
  }

  filterDataManager() {
    if (this.state.isManager && !this.state.isDirector) {
      let filteredStats = [];
      filteredStats = this.state.stats.filter((stat) => {
        {
          return stat.projectDTO.manager.id == this.state.uid;
        }
      });
      this.setState({
        stats: filteredStats,
      });
    }
  }

  setActiveIndex(event, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  writeMessage(spi, cpi) {
    var message = "";
    if (spi == 0 || cpi == 0) {
      message = projectStrings.indicator1;
    } else {
      if (spi > 1.0 && cpi > 1.0) {
        message = projectStrings.indicator2;
      } else if (spi < 1.0 && cpi > 1.0) {
        message = projectStrings.indicator3;
      } else if (spi > 1.0 && cpi < 1.0) {
        message = projectStrings.indicator4;
      } else if (spi > 1.0 && cpi == 1.0) {
        message = projectStrings.indicator5;
      } else if (spi < 1.0 && cpi == 1.0) {
        message = projectStrings.indicator6;
      } else if (spi == 1.0 && cpi > 1.0) {
        message = projectStrings.indicator7;
      } else if (spi == 1.0 && cpi < 1.0) {
        message = projectStrings.indicator8;
      } else {
        message = projectStrings.indicator9;
      }
    }
    return <Message info header={message} />;
  }

  render() {
    const { activeIndex, stats } = this.state;
    return (
      <React.Fragment>
        <Grid columns="equal" className="app" stackable>
          <Grid.Column className="panel_manage_users">
            <Label>{systemStrings.indicatorsReport + ":"}</Label>
            <Divider />
            <Header as="h3" attached="top">
              {systemStrings.projects}
            </Header>
            {stats.map((stat) => (
              <Accordion fluid styled attached="true">
                <Accordion.Title
                  active={activeIndex === stat.projectDTO.id}
                  index={stat.projectDTO.id}
                  onClick={this.setActiveIndex}
                >
                  <Icon name="dropdown" />
                  <Icon name="info" /> {stat.projectDTO.name}
                </Accordion.Title>
                <Accordion.Content active={activeIndex === stat.projectDTO.id}>
                  <Statistic.Group widths="four">
                    <Statistic>
                      <Statistic.Value>
                        <Icon name="calendar alternate outline" />
                        {stat.spi}
                      </Statistic.Value>
                      <Statistic.Label>
                        {systemStrings.schedulePerformanceIndex}
                      </Statistic.Label>
                    </Statistic>
                    <Statistic>
                      <Statistic.Value>
                        <Icon name="eur" />
                        {stat.cpi}
                      </Statistic.Value>
                      <Statistic.Label>
                        {systemStrings.costPerformanceIndex}
                      </Statistic.Label>
                    </Statistic>
                  </Statistic.Group>
                  {this.writeMessage(stat.spi, stat.cpi)}
                </Accordion.Content>
              </Accordion>
            ))}
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default IndicatorsReport;
