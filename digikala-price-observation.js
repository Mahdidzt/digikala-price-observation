const { Builder, By, Key, until } = require('selenium-webdriver');
require("chromedriver");
const chrome = require('selenium-webdriver/chrome');
const path = require("path");
const sound = require("sound-play");

(async function fetchDataFromUrl() {
  const options = new chrome.Options();
  options.addArguments("--window-size=1912,924");
  options.addArguments("--headless");
  let driver = await new Builder().forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  try {
    console.log('Started to fetch data');
    await driver.get("https://www.digikala.com/product/dkp-4358020/%D9%85%D8%A7%D9%88%D8%B3-%D9%84%D8%A7%D8%AC%DB%8C-%D9%85%D8%AF%D9%84-mx-master-3/");
    console.log('web page loaded');
    console.log('waiting for data...');
    const price = await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div[1]/div[3]/div[3]/div[2]/div[2]/div[2]/div[2]/div[3]/div[1]/div[8]/div/div[2]/div[1]/div[2]/div[1]/span")), 10000).getText();
    console.log('price: ', price);
    const revisePrice = convertToDigit(price);
    if (revisePrice <= 3_500_000) {
      console.log('reached the price !!!!!!!!!!!!!!');
      playAudio();
      return;
    }

    // repeat every 1 hour 
    setTimeout(fetchDataFromUrl, 60 * 60 * 1000);
    // setTimeout(fetchDataFromUrl, 1000);
    console.log('------------------------');

  } catch (err) {
    console.log('err: ', err);
  } finally {
    await driver.quit();
  }
})();


function convertToDigit(text) {
  if (!text)
    return text;

  text = text.toString().replace(/,/g, '').replace(/٬/g, '');
  return text.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
    return d.charCodeAt(0) - 1632; // Convert Arabic numbers
  }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
    return d.charCodeAt(0) - 1776; // Convert Persian numbers
  });
}


function playAudio() {
  const folderPath = path.join(__dirname, 'audio');
  const filePath = path.join(folderPath, "mixkit-scanning-sci-fi-alarm-905.wav");
  sound.play(filePath).then(() => playAudio());
}
