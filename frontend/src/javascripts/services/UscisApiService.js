const UscisApiService = {
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
  },

  createUser: function(name, dob, email, street1, street2, city, state, zip) {
    return fetch("/api/request_upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        street1: street1,
        street2: street2,
        city: city,
        state: state,
        zip: zip,
        user_id: "4132j34l1jhl1"
      })
    }).then(resp => {
      if (resp.status === 200) {
        console.log(resp.json());
        return resp.json();
      }
    });
  }
};

export default UscisApiService;
