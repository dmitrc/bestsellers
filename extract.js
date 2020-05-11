var cheerio = require('cheerio');
var fetch = require('node-fetch');
var fs = require('fs');

var exportLinks = [];

var blacklist = [
    "Apps for Android",
    "Books",
    "Gift Cards",
    "Kindle Store",
    "Livres en français"
];

async function parse(url, cat = []) {
    const args = {
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 10; Pixel 3a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36"
        }
    };

    const data = await fetch(url, args);
    const $ = cheerio.load(await data.text());

    const linkLists = $('ul', '#zg-mobile-browseRoot');

    const lastList = linkLists.last();
    const isLastListActive = lastList.find('.zg-mobile-selected').length > 0;

    if (isLastListActive) {
        return;
    }

    const links = lastList.find('.a-link-normal');

    const linksMap = links
        .map(function (i, el) {
            return {
                "name": $(this).text(),
                "url": $(this).attr("href"),
                "cat": cat
            };
        })
        .get();

    for (var link of linksMap) {
        if (cat.length == 0 && blacklist.indexOf(link.name) >= 0) {
            console.log(`Skipping: ${link.name}`);
            continue;
        }

        console.log(`${link.name} (${cat.join(" -> ")})`);
        exportLinks.push(link);

        await parse(link.url, [...cat, link.name]);
    }
}

parse("https://www.amazon.ca/gp/bestsellers")
    .then(() => {
        console.log(`Finished: ${exportLinks.length} links crawled!`);
        fs.writeFileSync('bestsellers.json', JSON.stringify(exportLinks));
    })
    .catch((err) => {
        console.error(err);
    });
