const AuthService = {
  // Returns a bool for if there is a valid token
  validToken: () => {
    const now = new Date();
    var expiration;

    // expiry header is stored as a string of a time integer;
    // fetch and parse into date
    const expiryHeader = sessionStorage.getItem("expiry");
    if (expiryHeader) {
      expiration = new Date(parseInt(expiryHeader));
    }
    if (sessionStorage.getItem("token") === null) {
      return false;
    }
    if (expiration < now) {
      return false;
    }
    return true;
  },

  clearToken: () => {
    sessionStorage.clear("token");
    sessionStorage.clear("expiry");
  }
};

export default AuthService;
