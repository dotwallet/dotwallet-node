const userName = localStorage.getItem('nickname');
const userID = localStorage.getItem('id');
const userPic = localStorage.getItem('avatar');
userName
  ? (document.getElementById('user-name').innerHTML = 'Hello ' + userName)
  : (document.getElementById('user-name').innerHTML = 'User not found');

userPic
  ? (document.getElementById('user-pic').src = userPic)
  : (document.getElementById('user-pic').alt = 'Avatar not found ');
document.getElementById('store-link').href = window.location.origin + '/store-front';
document.getElementById('store-button').href = window.location.origin + '/store-front';
