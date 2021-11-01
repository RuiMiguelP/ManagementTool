import { uid } from "rand-token";

export const key = "tokenValidationKey";

export const resetPasswordURL = locationURL().concat(
  "/reset.html?resetPassword="
);

export const redirectURL = locationURL().concat("/index.html");

function locationURL() {
  return window.location.href.slice(0, window.location.href.lastIndexOf("/"));
}

export var randomToken = uid(16);
