// Payments
document.getElementById('store-link').href = window.location.origin + '/store-front';
// basic payment order info
const order = {
  out_order_id: uuidv4(),
  coin_type: 'BSV',
  to: [
    {
      type: 'address',
      content: '1L3z6DzHpfr7pkkZmKfVNMjwY1984D5YRv',
      amount: 546,
    },
  ],
  product: {
    id: uuidv4(),
    name: 'bananas',
    detail: 'A lovely bunch of bananas',
  },
  subject: 'an order of fresh bananas',
  notify_url: APP_URL + '/payment-result', // replace  with your IP
};

// single payment order
document.getElementById('banana-button').addEventListener('click', async () => {
  document.getElementById('order-status').innerText = '';

  const orderIDResponse = await fetch(
    APP_URL + '/create-order', // replace with your IP
    {
      method: 'POST',
      body: JSON.stringify({
        ...order,
        redirect_uri: window.location.href, // replace with your IP
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    },
  );
  const orderIDData = await orderIDResponse.json();
  console.log('orderIDData', orderIDData);

  if (orderIDData.order_id) {
    window.location.href = `${DOTWALLET_API}/transact/order/apply_payment?order_id=${orderIDData.order_id}`;
  } else document.getElementById('order-status').innerText = 'error: ' + orderIDData;
});

// autopay
document.getElementById('autopay-button').addEventListener('click', async () => {
  console.log('clicked');
  const autoPaymentResponse = await fetch(
    APP_URL + '/autopay', // replace with your IP
    {
      method: 'POST',
      body: JSON.stringify({ ...order, user_id: localStorage.getItem('id') }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    },
  );
  const autoPaymentResponseData = await autoPaymentResponse.json();
  console.log(autoPaymentResponseData);
  if (autoPaymentResponseData.txid) document.getElementById('order-status').innerText = 'paid!';
  else if (autoPaymentResponseData.error && autoPaymentResponseData.error === 'balance too low')
    window.location.href = `${DOTWALLET_CLIENT}/wallet/open/transfer?redirect_url=${window.location.href}`;
  else document.getElementById('order-status').innerText = 'payment failed';
});
