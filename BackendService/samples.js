var generic_query = {};
generic_query.query = "(enriched_text.categories.label:'finance'|enriched_text.categories.label:'financial news'), publication_date>now-1week";
//generic_query.filter = "language:(english|en),publication_date>now-1week,(enriched_text.concepts.text:'equity'|enriched_text.concepts.text:'stock'), host:wsj.com | host: cmlviz.com";
generic_query.filter = "language:(english|en),(enriched_text.concepts.text:'equity'|enriched_text.concepts.text:'stock'), host:wsj.com | host: cmlviz.com";
generic_query.deduplicate = true;
generic_query.count = 20;
generic_query.return = "title,url,host,crawl_date"


var sample_attributes = {
    language: "en",
    hosts: ["wsj.com", "cmlviz.com"],
    interested_in: ["equity", "stock"],
    count: 5,
    return: "title,url,host,crawl_date",
    deduplicate: true
};

var sample_attributes2 = {
    interested_in: ["equity", "stock"]
};



financial_news_query = "(enriched_text.categories.label:'finance'|enriched_text.categories.label:'financial news'), publication_date>now-1week";
pub_date = "publication_date>now-1week";



module.exports = {
    generic_query: generic_query,
    sample_attributes: sample_attributes,
    financial_news_query: financial_news_query,
    pub_date: pub_date
}