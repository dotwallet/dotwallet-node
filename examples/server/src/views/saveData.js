// Save data on chain (with autopay)
const data_to_save = {
  bananas: 546,
  moreBananas: 746,
  yetMoreBananas: 946,
};
document.getElementById('save-data').addEventListener('click', async () => {
  const response = await fetch(
    APP_URL + '/save-data', // replace with your IP
    {
      method: 'POST',
      body: JSON.stringify({
        data_to_save,
        user_id: localStorage.getItem('id'),
        server_token: localStorage.getItem('server_token'),
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    },
  );
  const responseData = await response.json();
  // console.log('saveDataResponseData', responseData);
  if (responseData.txid) {
    document.getElementById('order-status').innerText = `Saved!`;
    document.getElementById('check-data-link').href = `https://satoshi.io/tx/${responseData.txid}`;
    document.getElementById('check-data-link').innerText = 'Check transaction';
    document.getElementById('check-data').style = 'display: initial';
    document.getElementById('check-data').addEventListener('click', () => {
      checkData(responseData.txid);
    });
  } else if (responseData.error && responseData.error === 'balance too low')
    window.location.href = `${DOTWALLET_CLIENT}/wallet/open/transfer?redirect_url=${window.location.href}`;
  else document.getElementById('order-status').innerText = 'Saving failed';

  async function checkData(txid) {
    const response = await fetch(APP_URL + '/get-tx-data', {
      method: 'POST',
      body: JSON.stringify({ txid, server_token: localStorage.getItem('server_token') }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    // console.log('checkDataResponseData', data);
    document.getElementById('check-data-display').innerText = JSON.stringify(data);
  }
});
