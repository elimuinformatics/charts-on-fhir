// window.env = {
//     clientId: "${CLIENT_ID}",
//     appTitle: "${APP_TITLE}"
//   };

(function (window) {
  window["env"] = window["env"] || {};
  window["env"]['clientId'] = "${CLIENT_ID}";
  window["env"]['appTitle'] = "${APP_TITLE}";
})(this);
