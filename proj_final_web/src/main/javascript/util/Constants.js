import {
  projectStrings,
  activityStrings,
} from "../Localization/TranslationLanguages";

export function typologyOptions() {
  return [
    { key: "fc", value: "FIX_COST", text: projectStrings.fixCost },
    { key: "tm", value: "TIME_MATERIALS", text: projectStrings.timeMaterials },
  ];
}

export function projectStateOptions() {
  return [
    { key: 1, text: projectStrings.planned, value: "PLANNED" },
    { key: 2, text: projectStrings.startup, value: "START_UP" },
    { key: 3, text: projectStrings.execution, value: "EXECUTION" },
    { key: 4, text: projectStrings.delivery, value: "DELIVERY" },
    { key: 5, text: projectStrings.warranty, value: "WARRANTY" },
    { key: 6, text: projectStrings.closed, value: "CLOSED" },
  ];
}

export function activityType() {
  return [
    { key: 1, text: activityStrings.meeting, value: "MEETING" },
    { key: 2, text: activityStrings.documentation, value: "DOCUMENTATION" },
    { key: 3, text: activityStrings.codification, value: "CODIFICATION" },
    { key: 4, text: activityStrings.tests, value: "TESTS" },
    { key: 5, text: activityStrings.installation, value: "INSTALLATION" },
    { key: 6, text: activityStrings.others, value: "OTHERS" },
  ];
}

export const alphanumericRegExp = /[^a-z0-9]/i;

export const integerRegExp = /[^0-9]/i;

export const doubleRegExp = new RegExp(/^(\d*\.)?\d+$/);

export const recaptchaSitekey = "6LcbAfwUAAAAAL9VpFA1QHwLaExRzSqU7ERuxsth";

export const CLIENT_ID =
  "659048183281-a7urc98f48t3br226u2om8c7s6ah9bfo.apps.googleusercontent.com";
