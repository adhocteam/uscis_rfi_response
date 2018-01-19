const UscisApiService = {
  login: function(email, password) {
    return fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(resp => {
        return resp.json();
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
