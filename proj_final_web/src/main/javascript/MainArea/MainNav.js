import React from "react";
import { Grid } from "semantic-ui-react";

const MainNav = ({ children }) => {
  return (
    <Grid.Column className="main_nav">
      <React.Fragment>{children}</React.Fragment>
    </Grid.Column>
  );
};

export default MainNav;
