const newsTiles = document.getElementById('newstiles');

$(document).ready( async() => {
    await fetch('/getPersonalisedFinanceNews').then(async(response) => {
        var news = await response.json();
        // alert(JSON.stringify(news));

        if ( news.length == 0) {
          newsTiles.innerHTML += `
          <div class="tile bx--row">
          <div class="bx--col bx--col-lg-16">
            <div class="bx--tile">
                <p>There is no news in the last 7 days as per your preferences.</p>
            </div>
          </div>
          </div>`
        } else {
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
        }
  });
});