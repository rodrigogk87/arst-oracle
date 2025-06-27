const url = "https://api.bluelytics.com.ar/v2/latest";

const response = await Functions.makeHttpRequest({ url });

if (!response.error) {
  const precio = response.data.blue.value_avg; // e.g. 1300 ARS/USD
  const result = 1 / precio; // ARS in USD
  const scaled = Math.round(result * 1e8); // scale to 1e8 for Solidity
  return Functions.encodeUint256(scaled);
} else {
  throw Error("Error fetching API");
}
