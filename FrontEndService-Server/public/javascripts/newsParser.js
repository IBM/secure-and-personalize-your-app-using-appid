const newsTiles = document.getElementById('newstiles');

$(document).ready( async() => {
    await fetch('/getFinanceNews').then(async(response) => {
        news = await response.json();
        // alert(JSON.stringify(news));

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
});
