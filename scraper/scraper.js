const Item = require('../models/item')
const puppeteer = require('puppeteer')

const scraper = async ()=> {
    const items = await Item.find()

    scrapItem('buh')
    console.log(items)
}

const scrapItem = async (item)=> {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const url = 'https://www.amazon.ca/HyperX-Alloy-Origins-Core-Customization/dp/B07YMHGP86/ref=sr_1_1?dchild=1&keywords=hyperx+alloy+origins+core&qid=1609116348&s=software&sr=1-1'    
    await page.goto(url)

    const [el3] = await page.$x('//*[@id="priceblock_ourprice"]')
    
    if (el3 === undefined) {
        await browser.close()
        console.log('scape failed')
        return
    }

    const txt2 = await el3.getProperty('textContent')
    const price = await txt2.jsonValue()

    await browser.close()
    console.log({srcTxt, rawText, price})
}

module.exports = scraper