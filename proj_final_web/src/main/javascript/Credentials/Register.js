import React, { Component } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Icon,
  Loader,
  Modal,
  Input,
  Image,
} from "semantic-ui-react";
import Recaptcha from "react-recaptcha";
import { postFormData, multiPartHeaders } from "../util/Functions";
import { usersAPI } from "../util/APIs";
import { key, randomToken, confirmationURL } from "../util/EmailConfirmation";
import { recaptchaSitekey } from "../util/Constants";
import AvatarEditor from "react-avatar-editor";

import { systemStrings } from "../Localization/TranslationLanguages";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      occupation: "",
      password: "",
      confirmPassword: "",
      messageSuccess: "",
      error: "",
      captchaVerificaction: false,
      modal: false,
      previewImage: "",
      croppedImage: "",
      blob: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.isFormEmpty = this.isFormEmpty.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.fileUploadHandler = this.fileUploadHandler.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleCropImage = this.handleCropImage.bind(this);
    this.uploadCroppedImage = this.uploadCroppedImage.bind(this);
  }

  openModal() {
    this.setState({
      modal: true,
    });
  }

  closeModal() {
    this.setState({
      modal: false,
    });
  }

  isFormValid() {
    if (!this.state.captchaVerificaction) {
      this.setState({
        error: systemStrings.confirmNotRobot,
        loading: false,
      });
      return false;
    }
    if (this.state.password.length < 6) {
      this.setState({
        error: systemStrings.password6Char,
        loading: false,
      });
      return false;
    }
    if (this.state.password != this.state.confirmPassword) {
      this.setState({
        error: systemStrings.passwordsDontMatch,
        loading: false,
      });
      return false;
    }
    if (this.isFormEmpty(this.state)) {
      this.setState({
        error: systemStrings.fillAllFields,
        loading: false,
      });
      return false;
    } else {
      return true;
    }
  }

  isFormEmpty({ name, email, password }) {
    return !name.length || !email.length || !password.length;
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    if (this.isFormValid()) {
      postFormData(usersAPI, multiPartHeaders(), this.buildNewUser()).then(
        (response) => {
          if (response.status == 201) {
            this.setState({
              name: "",
              email: "",
              occupation: "",
              password: "",
              confirmPassword: "",
              error: "",
              messageSuccess: systemStrings.userCreated,
              previewImage: "",
              croppedImage: "",
              blob: "",
              loading: false,
            });
          } else if (response.status == 409) {
            this.setState({
              email: "",
              error: systemStrings.emailInUse,
              messageSuccess: "",
              loading: false,
            });
          } else {
            this.setState({
              error: systemStrings.somethingWentWrong,
              messageSuccess: "",
              loading: false,
            });
          }
        }
      );
    }
  }

  buildNewUser() {
    const jwt = require("jsonwebtoken");
    var token = randomToken;
    let validationToken = jwt.sign(
      {
        email: this.state.email,
        token: token,
      },
      key
    );

    let formData = new FormData();
    formData.append("name", this.state.name);
    formData.append("email", this.state.email);
    formData.append("password", this.state.password);
    formData.append("occupation", this.state.occupation);
    formData.append("token", randomToken);
    formData.append("validationURL", confirmationURL.concat(validationToken));
    formData.append("uploadedFile", this.state.blob);
    return formData;
  }

  onloadCallback() {
    this.setState({ captchaVerificaction: false });
  }

  verifyCallback(response) {
    if (response) {
      this.setState({ captchaVerificaction: true, error: "" });
    }
  }

  expiredCallback() {
    this.setState({ captchaVerificaction: false });
  }

  fileUploadHandler(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({ previewImage: reader.result });
      });
    }
  }

  handleCropImage() {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageUrl,
          blob,
        });
      });
    }
  }

  uploadCroppedImage() {
    this.setState({ messageSuccess: systemStrings.photoUploaded }, () =>
      this.closeModal()
    );
  }

  render() {
    const {
      modal,
      previewImage,
      croppedImage,
      name,
      email,
      occupation,
      password,
      confirmPassword,
      error,
      loading,
      messageSuccess,
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="indexGrid">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            {systemStrings.register}
            <Icon name="signup" color="teal" />
          </Header>

          <Form.Field>
            <Button circular icon="photo" onClick={this.openModal} />
          </Form.Field>

          <Form size="large" onSubmit={this.onSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="name"
                icon="user"
                iconPosition="left"
                placeholder={systemStrings.name}
                type="text"
                value={name}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder={systemStrings.emailAddress}
                type="email"
                value={email}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                name="occupation"
                icon="book"
                iconPosition="left"
                placeholder={systemStrings.occupation}
                type="text"
                value={occupation}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder={systemStrings.password}
                type="password"
                value={password}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                name="confirmPassword"
                icon="lock"
                iconPosition="left"
                placeholder={systemStrings.confirmPassword}
                type="password"
                value={confirmPassword}
                onChange={this.handleChange}
              />
              <div className="recaptcha">
                <Recaptcha
                  sitekey={recaptchaSitekey}
                  render="explicit"
                  onloadCallback={this.onloadCallback.bind(this)}
                  verifyCallback={this.verifyCallback.bind(this)}
                  expiredCallback={this.expiredCallback.bind(this)}
                />
              </div>
              <Button color="teal" fluid size="large">
                {systemStrings.register}
              </Button>
            </Segment>
          </Form>
          <Message>
            {systemStrings.alreadyHaveRegister + " "}
            <a href="#" onClick={() => this.props.handleShowRegister()}>
              {systemStrings.signIn}
            </a>
          </Message>
          {error.length > 0 && (
            <Message error>
              <h3>{systemStrings.error}</h3>
              {error}
            </Message>
          )}
          <Loader active={loading} inline="centered" size="medium" />
          {messageSuccess.length > 0 && (
            <Message success>
              <h3>{systemStrings.success}</h3>
              {messageSuccess}
            </Message>
          )}
          {/* Photo User Modal */}
          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>{systemStrings.profilePhoto}</Modal.Header>
            <Modal.Content>
              <Input
                fluid
                type="file"
                label={systemStrings.profilePhoto_Register}
                name="userPhoto"
                onChange={this.fileUploadHandler}
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="grid_modal_user_photo">
                    {previewImage && (
                      <AvatarEditor
                        ref={(node) => (this.avatarEditor = node)}
                        image={previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImage && (
                      <Image
                        style={{ margin: "3.5em auto" }}
                        width={100}
                        height={100}
                        src={croppedImage}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage && (
                <Button
                  color="green"
                  inverted
                  onClick={this.uploadCroppedImage}
                >
                  <Icon name="save" /> {systemStrings.confirm}
                </Button>
              )}
              <Button color="green" inverted onClick={this.handleCropImage}>
                <Icon name="image" />
                {systemStrings.preview}
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" /> {systemStrings.cancel}
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
