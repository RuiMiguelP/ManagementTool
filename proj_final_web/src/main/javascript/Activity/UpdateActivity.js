import React from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Grid,
  Progress,
  TextArea,
  Label,
  Header,
  Checkbox,
  Message,
  Icon,
} from "semantic-ui-react";

import { projectsAPI } from "../util/APIs";
import { requestMultiPartHeaders, putFormData } from "../util/Functions";
import { integerRegExp } from "../util/Constants";

import {
  systemStrings,
  activityStrings,
} from "../Localization/TranslationLanguages";

export default class UpdateActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: -1,
      hoursLeft: 0,
      hoursSpend: 0,
      comment: "",
      file: null,
      fileType: "",
      executionPercentage: 0,
      totalHours: 0,
      addHoursLeft: false,
      error: "",
      success: "",
    };

    this.setActivity = this.setActivity.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleHoursSpendChange = this.handleHoursSpendChange.bind(this);
    this.handleHoursLeftChange = this.handleHoursLeftChange.bind(this);
    this.calcExecutionPercentage = this.calcExecutionPercentage.bind(this);
    this.updateActivity = this.updateActivity.bind(this);
    this.fileUploadHandler = this.fileUploadHandler.bind(this);
    this.clearStateOnClose = this.clearStateOnClose.bind(this);
  }

  clearStateOnClose() {
    this.setState({
      id: -1,
      hoursLeft: 0,
      hoursSpend: 0,
      comment: "",
      file: null,
      fileType: "",
      executionPercentage: 0,
      totalHours: 0,
      addHoursLeft: false,
      error: "",
      success: "",
    });
  }

  updateActivity() {
    putFormData(
      projectsAPI
        .concat("/")
        .concat(this.props.activity.projectId)
        .concat("/activity/update"),
      requestMultiPartHeaders(),
      this.activityUpdateConstructor()
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          this.props.updateActivity(data),
            this.setState({ success: activityStrings.activityUpdated });
        });
      } else {
        this.setState({
          error: systemStrings.somethingWentWrong,
        });
      }
    });
  }

  activityUpdateConstructor() {
    let formData = new FormData();
    formData.append("activityId", this.props.activity.id);
    formData.append("comment", this.state.comment);
    formData.append("hoursSpend", this.state.hoursSpend);
    formData.append("hoursLeft", this.state.hoursLeft);
    formData.append("executionPercentage", this.state.executionPercentage);
    formData.append("file", this.state.file);
    formData.append("fileType", this.state.fileType);

    return formData;
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleHoursLeftChange(e) {
    e.preventDefault();

    !integerRegExp.test(e.target.value)
      ? this.setState(
          {
            hoursLeft: Number(e.target.value),
            totalHours: Number(this.state.hoursSpend) + Number(e.target.value),
            error: "",
          },
          () => this.calcExecutionPercentage()
        )
      : window.alert(systemStrings.invalidInput);
  }

  handleHoursSpendChange(e) {
    e.preventDefault();

    if (
      !integerRegExp.test(e.target.value) &&
      e.target.value <= this.state.totalHours
    ) {
      this.setState(
        {
          hoursSpend: Number(e.target.value),
          hoursLeft: Number(this.state.totalHours) - Number(e.target.value),
          error: "",
        },
        () => this.calcExecutionPercentage()
      );
    } else if (Number(e.target.value) > this.state.totalHours) {
      this.setState({
        hoursSpend: Number(e.target.value),
        error: activityStrings.hoursSpendCannotBeBigger,
      });
    } else {
      window.alert(systemStrings.invalidInput);
    }
  }

  setActivity() {
    const { activity } = this.props;

    this.setState(
      {
        id: activity.id,
        hoursLeft: Number(activity.hoursLeft),
        hoursSpend: Number(activity.hoursSpend),
        totalHours: Number(activity.hoursLeft) + Number(activity.hoursSpend),
      },
      () => this.calcExecutionPercentage()
    );
  }

  calcExecutionPercentage() {
    const { hoursSpend, hoursLeft } = this.state;

    let executionPercentage =
      Number(hoursSpend * 100) / (Number(hoursSpend) + Number(hoursLeft));
    this.setState({ executionPercentage });
  }

  fileUploadHandler(e) {
    const file = e.target.files[0];
    var str = file.name.split(".");
    var fileType = str[str.length - 1];

    if (fileType == "docx" || fileType == "pdf") {
      this.setState({ file, fileType, error: "" });
    } else {
      this.setState({ error: activityStrings.errorFileType });
    }
  }

  render() {
    const {
      id,
      hoursLeft,
      hoursSpend,
      comment,
      executionPercentage,
      addHoursLeft,
      totalHours,
      error,
      success,
    } = this.state;
    return (
      <Modal
        basic
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onClose={this.clearStateOnClose}
        trigger={
          <Icon name="caret square up outline" onClick={this.setActivity} />
        }
        closeIcon
      >
        <Modal.Header>{activityStrings.updateActivity}</Modal.Header>
        <Modal.Content>
          {id > -1 && (
            <Progress
              indicating
              autoSuccess
              precision={2}
              percent={executionPercentage}
              progress="percent"
              inverted
            />
          )}
          <Form onSubmit={this.updateActivity}>
            <Grid stackable>
              <Grid.Row textAlign="center" columns="3">
                <Grid.Column divided="vertically">
                  <Header inverted> {activityStrings.hoursSpend} </Header>
                  <Input
                    name="hoursSpend"
                    value={hoursSpend}
                    onChange={this.handleHoursSpendChange}
                  />
                </Grid.Column>
                <Grid.Column divided="vertically">
                  <Header inverted> {activityStrings.totalHours} </Header>
                  <Label color="blue" size="big">
                    {totalHours}
                  </Label>
                </Grid.Column>
                <Grid.Column divided="vertically">
                  <Header inverted> {activityStrings.hoursLeft} </Header>
                  <Input
                    name="hoursLeft"
                    value={hoursLeft}
                    onChange={this.handleHoursLeftChange}
                    readOnly={!addHoursLeft}
                  />
                  <Header.Subheader>
                    <Checkbox
                      name="addHoursLeft"
                      onChange={() =>
                        this.setState({
                          addHoursLeft: !addHoursLeft,
                        })
                      }
                      checked={addHoursLeft}
                      type="checkbox"
                    />
                    {systemStrings.edit_question}
                  </Header.Subheader>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Header textAlign="left" inverted>
                  {systemStrings.comment_two_points}
                </Header>
                <TextArea
                  name="comment"
                  placeholder={systemStrings.comment}
                  value={comment}
                  onChange={this.handleChange}
                />
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header textAlign="left" inverted>
                    {systemStrings.uploadFile}
                  </Header>
                  <Input
                    fluid
                    inverted
                    type="file"
                    name="uploadFile"
                    onChange={this.fileUploadHandler}
                  />
                  <Message attached="bottom" size="tiny" floating>
                    {activityStrings.uploadFileType}
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Button
                  disabled={this.state.error.length > 0}
                  color="teal"
                  fluid
                  size="medium"
                >
                  {activityStrings.updateActivity}
                </Button>
              </Grid.Row>
            </Grid>
          </Form>
          {error.length > 0 && (
            <Message floating error>
              <h3>{systemStrings.error}</h3>
              {error}
            </Message>
          )}
          {success.length > 0 && (
            <Message floating success>
              <h3>{systemStrings.success}</h3>
              {success}
            </Message>
          )}
        </Modal.Content>
      </Modal>
    );
  }
}
