const bluelyticsUrl = "https://api.bluelytics.com.ar/v2/latest";
//binance seems to be blocked for chainlink, i may need to use intermediary endpoint where
//call: chainlink -> my endpint -> binance
//response: binance -> my endpoint -> chainlink
const binanceUrl = "https://api.binance.com/api/v3/ticker/price?symbol=USDTARS";
const binanceHeaders = {
  'X-MBX-APIKEY': secrets.binanceKey
};

const binanceResp = await Functions.makeHttpRequest({
  url: binanceUrl,
  headers: binanceHeaders
});
const bluelyticsResp = await Functions.makeHttpRequest({ url: bluelyticsUrl });

let prices = [];

// Check Bluelytics
if (!bluelyticsResp.error) {
  const bluePrice = bluelyticsResp.data.blue.value_avg;
  if (bluePrice > 0) {
    prices.push(bluePrice);
  }
}

// Check Binance
// i think chainlink fails here, we might need an api key
if (!binanceResp.error) {
  const binancePrice = parseFloat(binanceResp.data.price);
  if (binancePrice > 0) {
    prices.push(binancePrice);
  }
}

// At least one price must be available
if (prices.length === 0) {
  throw Error("Error fetching both APIs");
}

// Compute mean of available prices
const meanPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

// Convert to USD per ARS (invert)
const usdPerArs = 1 / meanPrice;

// Scale for Solidity (e.g., 1e8)
const scaled = Math.round(usdPerArs * 1e8);

console.log("Bluelytics response:", JSON.stringify(bluelyticsResp, null, 2));
console.log("Binance response:", JSON.stringify(binanceResp, null, 2));
console.log("Final prices array:", prices);
console.log("Computed mean price:", meanPrice);
console.log("Scaled value to return:", scaled);


return Functions.encodeUint256(scaled);
