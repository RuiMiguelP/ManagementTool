import React from "react";
import { Dropdown, Menu } from "semantic-ui-react";

import {
  setLanguages,
  languageOptions,
} from "../Localization/TranslationLanguages";

class MenuLocalization extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: localStorage.getItem("language") };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("language") || null) {
      setLanguages(localStorage.getItem("language"));
      this.props.updateLanguage(localStorage.getItem("language"));
    } else {
      setLanguages(languageOptions[0].value);
      localStorage.setItem("language", languageOptions[0].value);
      this.setState({ value: languageOptions[0].value }, () =>
        this.props.updateLanguage(localStorage.getItem("language"))
      );
    }
  }

  handleChange(e, { value }) {
    e.preventDefault();
    setLanguages(value);
    localStorage.setItem("language", value);
    this.setState({ value: value }, () => this.props.updateLanguage(value));
  }

  render() {
    const { value } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <Dropdown
            button
            className="icon"
            labeled
            icon="world"
            options={languageOptions}
            onChange={this.handleChange}
            value={value}
          />
        </Menu.Item>
      </Menu.Menu>
    );
  }
}

export default MenuLocalization;
