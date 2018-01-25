import history from "./history";

const updateIfPresent = (headers, headerName, sessionName) => {
  const val = headers.get(headerName);
  if (val) {
    sessionStorage.setItem(sessionName, val);
  }
};

const updateTokens = headers => {
  updateIfPresent(headers, "access-token", "token");
  updateIfPresent(headers, "expiry", "expiry");
  updateIfPresent(headers, "uid", "uid");
  updateIfPresent(headers, "client", "client");
};

const authedRequest = (path, settings, error) =>
  fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "access-token": sessionStorage.getItem("token"),
      client: sessionStorage.getItem("client"),
      uid: sessionStorage.getItem("uid"),
      expiry: sessionStorage.getItem("expiry"),
    },
    ...settings,
  }).then(resp => {
    if (resp.ok) {
      updateTokens(resp.headers);
      return resp.json();
    }
    if (resp.status === 401) {
      history.replace(`/login?next=${history.location.pathname}`);
    }
    throw new Error(error);
  });

const UscisApiService = {
  getAdmin: () => authedRequest("/admin", {}, "Failed to get admin."),

  // TODO: error handling
  getSignedUrl: (user_id, image_name, image_type) => {
    return fetch(`${BASE_URL}/submissions/presigned_url`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submission_id: submission_id,
        image_name: image_name,
        image_type: image_type,
      }),
    }).then(resp => {
      if (resp.status === 200) {
        return resp.json();
      }
    });
  },

  filterSubmissions: status => {
    return authedRequest(
      `/submissions/filter?status=${status}`,
      {},
      "Failed to get submissions."
    );
  },

  getSubmission: id =>
    authedRequest(`/submissions/${id}`, {}, `Failed to get submission ${id}.`),

  getSubmissions: () =>
    authedRequest("/submissions", {}, "Failed to get submissions."),

  login: (email, password) => {
    return fetch(`${BASE_URL}/auth/sign_in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then(resp => {
      if (resp.ok) {
        updateTokens(resp.headers);
        return resp.json();
      } else {
        throw new Error("Failed to log in.");
      }
    });
  },

  updateSubmission: ({ id, notes, status }) => {
    authedRequest(
      `/submissions/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ notes, status }),
      },
      `Failed to update submission ${id}.`
    );
  },

  createUser: (name, dob, email, street1, street2, city, state, zip) => {
    return authedRequest(`submissions/new_upload`, {
      method: "POST",
      body: JSON.stringify({
        name: name || "",
        dob: dob || "",
        email: email || "",
        street1: street1 || "",
        street2: street2 || "",
        city: city || "",
        state: state || "",
        zip: zip || "",
      }),
    });
  },
};

export default UscisApiService;
