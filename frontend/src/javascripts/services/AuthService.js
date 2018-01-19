// Returns a bool for if there is a valid token
function validToken() {
  const now = new Date();
  //   const expiration = new Date(sessionStorage.getItem("expiry"));
  if (sessionStorage.getItem("token") === null) {
    return false;
  }
  //   if (expiration < now) {
  //     return false;
  //   }
  return true;
}

export default validToken;
