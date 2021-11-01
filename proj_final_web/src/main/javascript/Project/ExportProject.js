import React from "react";

import {
  projectStrings,
  exportStrings,
} from "../Localization/TranslationLanguages";
import { TableExport } from "tableexport";
import { Button, Icon } from "semantic-ui-react";

export default class ExportProject extends React.Component {
  constructor(props) {
    super(props);
  }

  exportTable() {
    const { project } = this.props;

    var export_tables = new TableExport(
      document.getElementsByName("tableExport"),
      {
        exportButtons: false,
        formats: ["xlsx"],
        filename: project.name,
        sheetname: "tasks",
      }
    );

    var tables_data = export_tables.getExportData();

    var export_data = [];
    var xlsx_info = {};
    for (var table_id in tables_data) {
      xlsx_info = tables_data[table_id]["xlsx"];
      export_data.push(tables_data[table_id]["xlsx"].data);
    }
    var fileExtension = xlsx_info.fileExtension;
    var mimeType = xlsx_info.mimeType;

    this.exportmultisheet(
      export_data,
      mimeType,
      project.name,
      [exportStrings.tasks, exportStrings.resources, exportStrings.allocations],
      fileExtension,
      {},
      {},
      export_tables
    );
  }

  exportmultisheet(
    data,
    mime,
    filename,
    sheetnames,
    extension,
    merges = {},
    cols_width = {},
    export_tables
  ) {
    var sheet_data = null;

    var key = extension.substring(1);

    // create workbook
    var wb = new export_tables.Workbook();
    // create sheet for each table in the same page, and add all sheets to workbook
    for (var i = 0; i < data.length; i++) {
      wb.SheetNames.push(export_tables.escapeHtml(sheetnames[i]));
      var sheet_data = export_tables.createSheet(
        data[i],
        merges[sheetnames[i]] || [],
        cols_width[sheetnames[i]] || []
      );
      wb.Sheets[sheetnames[i]] = sheet_data;
    }
    var bookType = export_tables.getBookType(key);
    var wopts = {
        bookType: bookType,
        bookSST: false,
        type: "binary",
      },
      wbout = XLSX.write(wb, wopts);

    sheet_data = export_tables.string2ArrayBuffer(wbout);

    if (sheet_data) {
      saveAs(
        new Blob([sheet_data], { type: mime + ";" + export_tables.charset }),
        filename + extension,
        true
      );
    }
  }

  getPrecedents(activity) {
    let precedents = "";
    for (let i = 0; i < activity.precedents.length; i++) {
      if (i != activity.precedents.length - 1) {
        precedents += activity.precedents[i].id.toString() + ";";
      } else {
        precedents += activity.precedents[i].id.toString();
      }
    }

    return precedents;
  }

  render() {
    const { project } = this.props;

    return (
      <React.Fragment>
        <Button
          color="linkedin"
          floated="right"
          onClick={() => this.exportTable()}
        >
          <Icon name="download" />
          {projectStrings.exportProject}
        </Button>
        <div>
          <table name="tableExport">
            <thead>
              <tr style={{ display: "none" }}>
                <th>{exportStrings.id}</th>
                <th>{exportStrings.name}</th>
                <th>{exportStrings.start}</th>
                <th>{exportStrings.finish}</th>
                <th>{exportStrings.duration}</th>
                <th>{exportStrings.precedents}</th>
                <th>{exportStrings.resourcesNames}</th>
              </tr>
            </thead>
            <tbody>
              {project.activities.map((activity) => {
                let duration = (activity.hoursSpend + activity.hoursLeft) / 8;

                return (
                  <tr style={{ display: "none" }} key={activity.id}>
                    <td>{activity.id}</td>
                    <td className="tableexport-string target">
                      {activity.name.toString()}
                    </td>
                    <td>{activity.startDate}</td>
                    <td>{activity.endDate}</td>
                    <td>{duration}</td>
                    <td className="tableexport-string target">
                      {this.getPrecedents(activity)}
                    </td>
                    <td>{activity.allocation.user.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table name="tableExport">
            <thead>
              <tr style={{ display: "none" }}>
                <th>{exportStrings.id}</th>
                <th>{exportStrings.name}</th>
                <th className="tableexport-string target">
                  {exportStrings.maxUnits}
                </th>
              </tr>
            </thead>
            <tbody>
              {project.allocations.map((allocation) => {
                return (
                  <tr key={allocation.id} style={{ display: "none" }}>
                    <td>{allocation.user.id}</td>
                    <td className="tableexport-string target">
                      {allocation.user.name}
                    </td>
                    <td>{allocation.allocationPercentage}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table name="tableExport">
            <thead>
              <tr style={{ display: "none" }}>
                <th>{exportStrings.taskName}</th>
                <th>{exportStrings.resourceName}</th>
                <th>{exportStrings.percentDone}</th>
                <th>{exportStrings.taskId}</th>
                <th>{exportStrings.resourceId}</th>
              </tr>
            </thead>
            <tbody>
              {project.activities.map((activity) => {
                return (
                  <tr key={activity.id} style={{ display: "none" }}>
                    <td>{activity.name}</td>
                    <td className="tableexport-string target">
                      {activity.allocation.user.name}
                    </td>
                    <td>{activity.executionPercentage}</td>
                    <td>{activity.id}</td>
                    <td>{activity.allocation.user.id}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}
