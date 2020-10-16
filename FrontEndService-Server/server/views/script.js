// import { Tile } from 'carbon-components';
// Tile.create(document.getElementById('tilex'));

// Modal.init();

// Tile.create(document.getElementById('tile1'));
// const modalElement = document.getElementById('tilex');
// const modalInstance = Modal.create(modalElement);
// modalInstance.show();

const newsTiles = document.getElementById('newstiles');

// const addMoreTiles = async() => {
//     news = [{"name":"Shikha", "Company":"IBM"}, {"name": "John", "Company":"Wipro"}];
//     news.forEach(element => {
//         newsTiles.innerHTML += `
//         <div class="bx--col-lg-4">
//             <div class="outside">
//                 <div class="inside">
//                     <div class="bx--tile">
//                         <h3>Name: ${element.name}</h3>
//                         <p>Salary: ${element.Company}</p>
//                     </div>
//                 </div>
//             </div><br>
//         </div>`
//     }); 
// };

$(document).ready(() => {
    //news = getFinanceNews();

    // news = [{"name":"Shikha", "Company":"IBM"}, {"name": "John", "Company":"Wipro"}];
    news = [
        {
            "title": "Jennifer Lawrence in the COVID uniform in New York with husband Cooke Maroney",
            "text": "Credit: CBS 2 New York Duration: 02:19 Published 7 hours ago Remote learning will be the order of the day for the foreseeable future as health officials work to bring the infection rates in nine zip codes in Brooklyn and Queens down. CBS2's Ali Bauman reports Credit: CBS 2 New",
            "publication_date": "2020-10-06T19:51:00Z",
            "url": "https://www.onenewspage.com/n/Celebrities/1zlu610r9q/Jennifer-Lawrence-in-the-COVID-uniform-in-New.htm",
            "host": "onenewspage.com",
            "sentiment": "negative"
        },
        {
            "title": "Fortinet to Announce Third Quarter 2020 Financial Results",
            "text": "Fortinet to Announce Third Quarter 2020 Financial Results SUNNYVALE, Calif. - Oct 1, 2020 Fortinet announced that it will hold a conference call to discuss its third quarter 2020 financial results on Thursday, October 29 at 1:30 p.m. Pacific Time (4:30 p.m. Eastern Time).",
            "publication_date": "2020-10-01T13:00:00Z",
            "url": "http://feeds.feedburner.com/corporate/about-us/newsroom/press-releases/2020/fortinet-to-announce-third-quarter-2020-financial-results",
            "host": "feeds.feedburner.com",
            "sentiment": "positive"
        },
        {
            "title": "Fox News Paid Kimberly Guilfoyle's Former Assistant",
            "text": "The New Yorker reports Fox News paid up to $4 million to settle sexual harassment...",
            "publication_date": "2020-10-02T15:19:00-05:00",
            "url": "https://www.onenewspage.com/n/Front+Page/1zlu60yt9l/Fox-News-Paid-Kimberly-Guilfoyle-Former-Assistant.htm",
            "host": "onenewspage.com",
            "sentiment": "negative"
        }
    ];

    news.forEach(element => {
        newsTiles.innerHTML += `
        <div class="tile bx--row">
        <div class="bx--col bx--col-lg-16">
            <div class="bx--tile">
                <h3>${element.title}</h3>
                <p>${element.text}</p>
                <p>Published On: ${element.publication_date}</p>
                <p>URL: <a href=${element.url}>${element.url}</a></p>
                <p>Host: ${element.host}</p>
                <p>Sentiment: ${element.sentiment}</p>
            </div>
        </div>
        </div>`
    });
});

const getFinanceNews = async () => {
    // await fetch('/getFinanceNews').then(async(response) => {
    //     data = await response.json();
    //     // twilioStatus.innerHTML = data.status;
    // });
    data = {};
};

$('#personalize').on('click', function() {
    fetch('/appid/callback');
});

$('#submit').on('click', function() {
    fetch('/saveCustomAttributes');
});