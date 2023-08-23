let token = localStorage.getItem("token");

const makePostRequest = async (data, endpoint, successCallback, errorCallback) => {
    try {
      const sent = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const response = await sent.json();
      successCallback(response);
    } catch (error) {
      console.log(error);
      errorCallback(error);
    }
  };

if (token) {
    makePostRequest({ token }, "https://shayraisa.marvinsaik.repl.co/api/verify-token", (data) => {
        if (data.code === 200) {
            window.location.href = '/';
        } else {
            window.location.href = '/login';
        }
    })
} else {

}