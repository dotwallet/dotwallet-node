const scope = encodeURIComponent('user.info autopay.bsv');
const redirectURI = encodeURIComponent(`${APP_URL}/log-in-redirect`);
const loginState = uuidv4();
localStorage.setItem('loginState', loginState);
const loginURL = `${DOTWALLET_CLIENT}/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code&state=${loginState}&scope=${scope}`;
// console.log('url\n', loginURL);
document.getElementById('login-link').href = loginURL;
