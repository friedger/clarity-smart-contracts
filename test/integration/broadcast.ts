const CORE_NODE_API_URL = "http://127.0.0.1:9000/v2/transactions";
const fetch = require("node-fetch");

export function broadcast(transaction) {
  const tx = transaction.serialize();
  console.log(tx);
  const requestHeaders = {
    Accept: "application/json",
    "Content-Type": "application/octet-stream",
    referrer: "no-referrer",
    referrerPolicy: "no-referrer",
  };
  const options = {
    method: "POST",
    headers: requestHeaders,
    body: tx,
  };
  const url = `${CORE_NODE_API_URL}/v2/transactions`;
  return fetch(url, options).then((response) => {
    if (response.ok) {
      return response.text();
      // return response.json();
    } else if (response.status === 400) {
      throw new Error("Transaction rejected");
    } else {
      throw new Error("Remote endpoint error");
    }
  });
}
