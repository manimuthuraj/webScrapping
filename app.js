const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const data = "http://www.cmdalayout.com/CommodityRate/CommodityRateToday.aspx";

async function scrapping() {
  try {
    let marketData = await request({
      uri: data,
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip,deflate",
        "Accept-Language": "en-US,en;q=0.9",
      },
      gzip: true,
    });

    let $ = cheerio.load(marketData);
    let finalData = [];
    $("tbody > tr").each((index, element) => {
      const vegitable = $($(element).find("td")[0]).text();
      const minPrice = $($(element).find("td")[1]).text();
      const maxPrice = $($(element).find("td")[2]).text();
      finalData.push({
        vegitable: vegitable,
        minPrice: minPrice,
        maxPrice: maxPrice,
      });
    });
    console.log(finalData);

    const j2cp = new json2csv();
    const csv = j2cp.parse(finalData);

    fs.writeFileSync("./data.csv", csv, "utf-8");
  } catch (error) {
    console.log(error);
  }
}

scrapping();
