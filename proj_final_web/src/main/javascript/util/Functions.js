import { Responsive } from "semantic-ui-react";

export function postData(api, headers, body) {
  return fetch(api, {
    method: "POST",
    headers,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(body),
  });
}

export function postFormData(api, headers, body) {
  return fetch(api, {
    method: "POST",
    headers,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body,
  });
}

export function putFormData(api, headers, body) {
  return fetch(api, {
    method: "PUT",
    headers,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body,
  });
}

export function putData(api, headers, body) {
  return fetch(api, {
    method: "PUT",
    headers,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(body),
  });
}

export function getData(api, headers) {
  return fetch(api, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers,
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
}

export function simpleHeaders() {
  var headers = new Headers();
  headers.append("Content-Type", "application/json;charset=utf-8");
  headers.append("Accept", "application/json;charset=utf-8");
  headers.append("Cache-Control", "no-cache");
  headers.append("Host", "localhost:8080");
  return headers;
}

export function multiPartHeaders() {
  var headers = new Headers();
  headers.append("Accept", "application/json;charset=utf-8");
  headers.append("Cache-Control", "no-cache");
  headers.append("Host", "localhost:8080");
  return headers;
}

export function requestMultiPartHeaders() {
  var headers = new Headers();
  headers.append("Accept", "application/json;charset=utf-8");
  headers.append("Cache-Control", "no-cache");
  headers.append("Host", "localhost:8080");
  headers.append("email", localStorage.getItem("email"));
  headers.append("token", localStorage.getItem("token"));
  return headers;
}

export function requestHeaders() {
  var headers = new Headers();
  headers.append("Content-Type", "application/json;charset=utf-8");
  headers.append("Accept", "application/json;charset=utf-8");
  headers.append("Cache-Control", "no-cache");
  headers.append("Host", "localhost:8080");
  headers.append("email", localStorage.getItem("email"));
  headers.append("token", localStorage.getItem("token"));
  return headers;
}

export function checkMobile() {
  return window.innerWidth < Responsive.onlyMobile.maxWidth;
}

/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
export function getParams(url) {
  var params = {};
  var parser = document.createElement("a");
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
}

export function localCostFormat(cost) {
  if (localStorage.getItem("language") === "pt") {
    return cost.replace(".", ",");
  }
  return cost;
}

export function checkProfileUserOrDirector() {
  if (
    JSON.parse(localStorage.getItem("isUser")) ||
    JSON.parse(localStorage.getItem("isDirector"))
  ) {
    return true;
  }
  return false;
}
