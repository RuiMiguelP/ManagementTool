import React from "react";
import { Modal, Button, Icon, Table } from "semantic-ui-react";
import { activityHistoryAPI } from "../util/APIs";
import { getData, requestHeaders } from "../util/Functions";

import {
  systemStrings,
  activityStrings,
} from "../Localization/TranslationLanguages";

class ViewHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      activityId: this.props.activity.id,
      error: "",
      historyData: [],
    };
    this.checkHistory = this.checkHistory.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }
  componentDidMount() {
    this.checkHistory();
  }

  checkHistory() {
    getData(
      activityHistoryAPI.concat("/").concat(this.state.activityId),
      requestHeaders(),
      {}
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          this.setState({
            historyData: data,
          });
        });
      } else {
        this.setState({
          error: systemStrings.somethingWentWrong,
        });
      }
    });
  }

  saveByteArray(reportName, byte, fileType) {
    var blob = this.checkFileType(byte, fileType);
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }

  checkFileType(byte, fileType) {
    if (fileType == "docx") {
      return new Blob([byte], {
        type:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
    } else if (fileType == "pdf") {
      return new Blob([byte], { type: "application/pdf" });
    }
  }

  base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  downloadFile(file, fileType) {
    var sampleArr = this.base64ToArrayBuffer(file);
    this.saveByteArray(systemStrings.document, sampleArr, fileType);
  }

  render() {
    const { historyData } = this.state;

    return (
      <Modal
        basic
        closeOnEscape={false}
        closeOnDimmerClick={false}
        trigger={
          <Button circular icon="history" onClick={() => this.checkHistory()} />
        }
        closeIcon
      >
        <Modal.Header>{activityStrings.activityHistory}</Modal.Header>
        <Modal.Content>
          <Table celled inverted selectable textAlign="center">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{systemStrings.comment}</Table.HeaderCell>
                <Table.HeaderCell>{systemStrings.file}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {historyData.map((history) => (
                <Table.Row key={history.activityId}>
                  <Table.Cell>{history.comment}</Table.Cell>
                  <Table.Cell>
                    {history.fileType.length > 0 && (
                      <Icon
                        name="download"
                        onClick={() =>
                          this.downloadFile(history.file, history.fileType)
                        }
                      />
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ViewHistory;
