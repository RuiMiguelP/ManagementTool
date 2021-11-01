import React from "react";
import { Label, Input, Checkbox } from "semantic-ui-react";
import {
  userStrings,
  systemStrings,
} from "../Localization/TranslationLanguages";

class FiltersRoles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailSearch: "",
      isAdminSearch: false,
      isDirectorSearch: false,
      isUserSearch: false,
      isVisitorSearch: false,
    };
    this.updateEmailSearch = this.updateEmailSearch.bind(this);
    this.updateAdminSearch = this.updateAdminSearch.bind(this);
    this.updateDirectorSearch = this.updateDirectorSearch.bind(this);
    this.updateUserSearch = this.updateUserSearch.bind(this);
    this.updateVisitorSearch = this.updateVisitorSearch.bind(this);
  }

  updateAdminSearch() {
    this.setState(
      ({ isAdminSearch }) => ({ isAdminSearch: !isAdminSearch }),
      () => this.props.onFilterChange(this.state)
    );
  }

  updateDirectorSearch() {
    this.setState(
      ({ isDirectorSearch }) => ({
        isDirectorSearch: !isDirectorSearch,
      }),
      () => this.props.onFilterChange(this.state)
    );
  }

  updateUserSearch() {
    this.setState(
      ({ isUserSearch }) => ({ isUserSearch: !isUserSearch }),
      () => this.props.onFilterChange(this.state)
    );
  }

  updateVisitorSearch() {
    this.setState(
      ({ isVisitorSearch }) => ({
        isVisitorSearch: !isVisitorSearch,
      }),
      () => this.props.onFilterChange(this.state)
    );
  }

  updateEmailSearch(e) {
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => this.props.onFilterChange(this.state)
    );
  }

  render() {
    const {
      emailSearch,
      isAdminSearch,
      isDirectorSearch,
      isUserSearch,
      isVisitorSearch,
    } = this.state;
    return (
      <React.Fragment>
        {/* Filters */}
        <Input
          icon="search"
          placeholder={systemStrings.searchByEmail}
          name="emailSearch"
          value={emailSearch}
          onChange={this.updateEmailSearch}
        />
        <Label horizontal size="large">
          {userStrings.admin}
          <Checkbox
            name="isAdminSearch"
            defaultChecked={isAdminSearch}
            onChange={this.updateAdminSearch}
          />
        </Label>

        <Label horizontal size="large">
          {userStrings.director}
          <Checkbox
            name="isDirectorSearch"
            defaultChecked={isDirectorSearch}
            onChange={this.updateDirectorSearch}
          />
        </Label>

        <Label horizontal size="large">
          {userStrings.user}
          <Checkbox
            name="isUserSearch"
            defaultChecked={isUserSearch}
            onChange={this.updateUserSearch}
          />
        </Label>

        <Label horizontal size="large">
          {userStrings.visitor}
          <Checkbox
            name="isVisitorSearch"
            defaultChecked={isVisitorSearch}
            onChange={this.updateVisitorSearch}
          />
        </Label>
      </React.Fragment>
    );
  }
}

export default FiltersRoles;
