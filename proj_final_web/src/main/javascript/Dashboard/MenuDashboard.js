import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { systemStrings } from "../Localization/TranslationLanguages";

const MenuDashboard = ({ goToAllocationsReport, goToIndicatorsReport }) => {
  return (
    <React.Fragment>
      <Menu.Item
        className="sidebar_add_project"
        style={{ opacity: 0.7 }}
        onClick={goToAllocationsReport}
      >
        <span>
          <Icon name="male" />
          {systemStrings.allocationReport}
        </span>
      </Menu.Item>
      {(JSON.parse(localStorage.getItem("isDirector")) ||
        JSON.parse(localStorage.getItem("isManager"))) && (
        <Menu.Item
          className="sidebar_add_project"
          style={{ opacity: 0.7 }}
          onClick={goToIndicatorsReport}
        >
          <span>
            <Icon name="info" />
            {systemStrings.indicatorsReport}
          </span>
        </Menu.Item>
      )}
    </React.Fragment>
  );
};

export default MenuDashboard;
