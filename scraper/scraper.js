const Item = require('../models/item')
const puppeteer = require('puppeteer')

const scraper = async ()=> {
    const items = await Item.find()

    for (item of items) {
        await scrapeItem(item)
    }
}

const scrapeItem = async (item)=> {
    if (!item) return

    // console.log(item)
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const url = item.link    
    console.log(item)
    
    try {
        await page.goto(url)

        const [el3] = await page.$x('//*[@id="priceblock_ourprice"]')
        const [el4] = await page.$x('//*[@id="priceblock_saleprice"]')

        if (el3 === undefined && el4 === undefined) {
            await browser.close()
            console.log('scrape failed')
            const current = new Date()
            item.status = `No price available. Last checked: ${current}`
            item.save( err => {
                if (err) throw 'error scraping item'
            
                return "No price available currently for this item"
            })
        }

        let newprice = null
        
        if (el3 === undefined || el4 === undefined) {
            const elf = (el3 === undefined) ? el4: el3 
            const txt2 = await elf.getProperty('textContent')
            const text = await txt2.jsonValue()
            newprice = text.replace( /^\D+/g, '')
        } else {
            const txt2 = await el3.getProperty('textContent')
            const text = await txt2.jsonValue()
            const price1 = text.replace( /^\D+/g, '')

            const txt3 = await el4.getProperty('textContent')
            const text2 = await txt3.jsonValue()
            const price2 = text2.replace( /^\D+/g, '')
             
            newPrice = (price1 > price2) ? price2: price1
        }

        let newdate = new Date()

        console.log({newprice, newdate})

        item.price.push(newprice)
        item.date.push(newdate)
        item.status = `Price updated`
        
        item.save((err)=>{
            if (err) console.log('error')

            console.log('saved')
        })    

        browser.close()

        return "Added new price data"

    } catch (error) {
        console.error(error)
    }
}

module.exports.scraper = scraper
module.exports.scrapeItem = scrapeItem