const UscisApiService = {
  login: (email, password) => {
    sessionStorage.setItem("token", "FAKE-ACCESS-TOKEN");
    sessionStorage.setItem("client", "FAKE-CLIENT-ID");
    sessionStorage.setItem("uid", email);
    sessionStorage.setItem("expiry", Date.now() + 1209600000); //two weeks
    return Promise.resolve();
  },
};

export default UscisApiService;
