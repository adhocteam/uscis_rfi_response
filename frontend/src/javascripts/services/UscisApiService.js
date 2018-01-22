const authHeaders = () => ({
  headers: {
    Accept: "application/json",
    "access-token": sessionStorage.getItem("token"),
    client: sessionStorage.getItem("client"),
    uid: sessionStorage.getItem("uid"),
  }
});

const UscisApiService = {
  getAdmin: () => {
    return fetch("/admin", authHeaders()).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("Failed to get admin.");
      }
    }).catch(err => {
      console.error(err);
    });
  },

  login: (email, password) => {
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
    }).then(resp => {
      if (resp.ok) {
        sessionStorage.setItem("token", resp.headers.get("access-token"));
        sessionStorage.setItem("client", resp.headers.get("client"));
        sessionStorage.setItem("uid", resp.headers.get("uid"));
        // expiry appears to be returned in seconds, javascript is milliseconds
        sessionStorage.setItem("expiry", 1000 * resp.headers.get("expiry"));
        return resp.json();
      } else {
        throw new Error("Failed to log in.");
      }
    }).catch(err => {
      console.error(err);
    });
  },

  // TODO: error handling
  getSignedUrl: (user_id, image_name, image_type) => {
    return fetch("/submissions/presigned_url", {
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
  },

  getSubmission: (id) => {
    return fetch(`/submissions/${id}`, authHeaders()).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error(`Failed to get submission ${id}`);
      }
    }).catch(err => {
      console.error(err);
    });
  }
};

export default UscisApiService;
