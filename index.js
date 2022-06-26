const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, accountToken);

const url =
  "https://www.amazon.com/2021-Apple-24-inch-8%E2%80%91core-256GB/dp/B0931SPLDD/ref=sr_1_3?crid=2KKHHWIKDNCN0&keywords=mac&qid=1656253801&sprefix=mac%2Caps%2C154&sr=8-3&ufe=app_do%3Aamzn1.fos.08f69ac3-fd3d-4b88-bca2-8997e41410bb";

// Set Interval
const handle = setInterval(scrape, 20000);

const product = { name: "", price: "", link: "" };
const scrape = async () => {
  const { data } = await axios.get(url);
  // Load HTML
  const $ = cheerio.load(data);
  const item = $("div#dp-container");
  // Get Data
  product.name = $(item).find("h1 span#productTitle").text();
  product.link = url;
  const price = $(item)
    .find("span .a-price-whole")
    .first()
    .text()
    .replace(/[,.]/g, "");
  const priceNum = parseInt(price);
  product.price = priceNum;

  // Send SMS
  if (priceNum < 1000) {
    client.messages
      .create({
        body: `The Proce of ${product.name} went below ${price}. Purchase it at ${product.link}`,
        from: "19784876124",
        to: "7861234567",
      })
      .then((message) => {
        console.log(message);
        clearInterval(handle);
      });
  }
};

scrape();
