window.env = {
  clientId: "${CLIENT_ID}",
  appTitle: "${APP_TITLE}",
  cdsicLogo: bool("${CDSIC_LOGO}"),
};

function bool(value) {
  return value.length > 0 && value.toLowerCase() !== "false";
}
