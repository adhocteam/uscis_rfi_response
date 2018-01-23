import history from "../history";

const authedRequest =
  (url, settings, error) => fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "access-token": sessionStorage.getItem("token"),
        client: sessionStorage.getItem("client"),
        uid: sessionStorage.getItem("uid"),
      },
      ...settings,
    }).then(resp => {
    if (resp.ok) { return resp.json(); }
    if (resp.status === 401) { history.replace(`/login?next=${history.location.pathname}`); }
    throw new Error(error);
  });

const UscisApiService = {
  getAdmin: () => authedRequest("/admin", {}, "Failed to get admin."),

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

  getSubmission: (id) => authedRequest(`/submissions/${id}`, {}, `Failed to get submission ${id}.`),

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
    });
  }
};

export default UscisApiService;
