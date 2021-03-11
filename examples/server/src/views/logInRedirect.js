const urlParams = new URLSearchParams(window.location.search);
const state = urlParams.get('state');
const code = urlParams.get('code');
const savedState = localStorage.getItem('loginState');

callAuth = async () => {
  const authCall = await fetch(`${APP_URL}/auth`, {
    method: 'POST',
    body: JSON.stringify({
      code,
      redirect_uri: `${APP_URL}/log-in-redirect`, // this must match step one
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const authResponse = await authCall.json();
  // console.log({ authResponse });
  for (const item in authResponse) {
    localStorage.setItem(item, authResponse[item]);
  }
  const homepageURL = `${APP_URL}/logged-in`;
  // console.log('homepageURL', homepageURL);
  window.location.href = homepageURL;
};
if (state != savedState) {
  alert('error validating request');
} else {
  callAuth();
}
