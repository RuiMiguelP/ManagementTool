import React from "react";
import { ToastsContainer, ToastsStore } from "react-toasts";
import { wsURL } from "../util/APIs";

import {
  projectStrings,
  activityStrings,
  userStrings,
} from "../Localization/TranslationLanguages";

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: null,
      message: "",
    };
  }

  componentDidMount() {
    var path = localStorage.getItem("uid");

    if (JSON.parse(localStorage.getItem("isLoggedIn"))) {
      this.ws = new WebSocket(wsURL + path);

      this.ws.onopen = () => {
        console.log("Opened Connection Notification!");
      };

      this.ws.onmessage = (event) => {
        let serverMessage = JSON.parse(event.data);

        switch (serverMessage.notificationType) {
          case "NEW_PROJECT":
            this.setState(
              {
                message: projectStrings.formatString(
                  projectStrings.newProject,
                  {
                    projectName: serverMessage.projectDTO.name,
                    projectCode: serverMessage.projectDTO.code,
                  }
                ),
              },
              () => this.props.addProjectWs(serverMessage.projectDTO)
            );
            ToastsStore.warning(this.state.message, 10000);
            break;
          case "ACTIVITY_CHANGED":
            this.setState(
              {
                message: activityStrings.formatString(
                  activityStrings.activityChanged,
                  {
                    activityName: serverMessage.activityDTO.name,
                    projectName: serverMessage.projectDTO.name,
                  }
                ),
              },
              () => this.props.updateActivityWs(serverMessage.activityDTO)
            );
            ToastsStore.warning(this.state.message, 10000);
            break;
          case "UPDATE_ACTIVITY":
            this.setState(
              {
                message: activityStrings.formatString(
                  activityStrings.activityUpdated,
                  {
                    activityName: serverMessage.activityDTO.name,
                    projectName: serverMessage.projectDTO.name,
                  }
                ),
              },
              () => this.props.updateActivityWs(serverMessage.activityDTO)
            );
            ToastsStore.warning(this.state.message, 10000);
            break;
          case "USER_CHANGED":
            this.setState(
              {
                message: userStrings.formatString(userStrings.userChanged),
              },
              () => this.props.updateUserWs(serverMessage.userDTO)
            );
            ToastsStore.warning(this.state.message, 10000);
            break;
          case "PROJECT_CHANGED":
            this.setState(
              {
                message: projectStrings.formatString(
                  projectStrings.projectChanged,
                  {
                    projectName: serverMessage.projectDTO.name,
                  }
                ),
              },
              () => this.props.replaceEditedProjectWs(serverMessage.projectDTO)
            );
            ToastsStore.warning(this.state.message, 10000);
            break;

          case "NEW_ACTIVITY":
            this.setState(
              {
                message: activityStrings.formatString(
                  activityStrings.newActivity,
                  {
                    activityName: serverMessage.activityDTO.name,
                    projectName: serverMessage.projectDTO.name,
                    projectCode: serverMessage.projectDTO.code,
                  }
                ),
              },

              () => this.props.setNewActivityWs(serverMessage.activityDTO)
            );
            ToastsStore.warning(this.state.message, 10000);
            break;
          case "NEW_RESOURCE":
            this.setState(
              {
                message: projectStrings.formatString(
                  projectStrings.resourcesAdded,
                  {
                    projectName: serverMessage.projectDTO.name,
                  }
                ),
              },
              () => this.props.setNewResourceWs(serverMessage.allocationsDTO)
            );
            ToastsStore.warning(this.state.message, 10000);
            break;
          case "SESSION_OUT":
            this.props.logout();
            this.props.messageWarning();
            break;
        }
      };
    }
  }

  componentWillUnmount() {
    this.ws.close = () => {
      console.log("Closed Notification connection.");
    };
  }

  render() {
    return (
      <React.Fragment>
        <ToastsContainer store={ToastsStore} />
      </React.Fragment>
    );
  }
}

export default Notification;
