// Misc Session Storage Utilities

// use session storage to determine if user is logged in
function isLoggedIn() {
  return !!sessionStorage.getItem("token");
}

function getEmail() {
  return sessionStorage.getItem("uid");
}

export { isLoggedIn, getEmail };
