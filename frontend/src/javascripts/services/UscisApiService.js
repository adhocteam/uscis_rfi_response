const UscisApiService = {
  // logs a user in, persisting session token and expiration to
  // session storage
  login: function(email, password) {
    return fetch("/auth/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(resp => {
        if (resp.status === 200) {
          sessionStorage.setItem("token", resp.headers.get("access-token"));
          // expiry appears to be returned in seconds, javascript is milliseconds
          sessionStorage.setItem("expiry", 1000 * resp.headers.get("expiry"));
          return resp.json();
        } else {
          return {};
        }
      })
      .catch(err => {
        console.error(err);
      });
  },
  // TODO: error handling
  getSignedUrl: function(user_id, image_name, image_type) {
    return fetch("/api/presigned_url", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user_id,
        image_name: image_name,
        image_type: image_type
      })
    }).then(resp => {
      if (resp.status === 200) {
        return resp.json();
      }
    });
  }
};

export default UscisApiService;
