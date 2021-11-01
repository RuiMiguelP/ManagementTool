import { uid } from "rand-token";

export const key = "tokenValidationKey";

export const confirmationURL = locationURL().concat(
  "/confirmation.html?confirmationToken="
);

export const resetPasswordURL = locationURL().concat(
  "/resetPassword.html?resetToken="
);

export const redirectURL = locationURL().concat("/index.html");

function locationURL() {
  return window.location.href.slice(0, window.location.href.lastIndexOf("/"));
}

export var randomToken = uid(16);
