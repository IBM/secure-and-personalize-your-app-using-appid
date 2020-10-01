samples = require("./samples");

function getInterests(attributes) {
    var interestsQueryString = "";
    var interests = "";
    if( attributes.interested_in ){
        interests = attributes.interested_in;
        interests.forEach(function (item) {
            if (interestsQueryString.length == 0) {
                interestsQueryString = "("
            } else {
                interestsQueryString = interestsQueryString + "|"
            }
            interestsQueryString = interestsQueryString + "enriched_text.concepts.text:'" + item + "'";
        });
    }
    if (interestsQueryString.length > 0) {
        interestsQueryString = interestsQueryString + ")";
    }
    return interestsQueryString;
}

function getHosts(attributes) {
    var hostsQueryString = ""
    var hosts = "";
    if (attributes.hosts) {
        hosts = attributes.hosts
        hosts.forEach(function (item) {
            if (hostsQueryString.length == 0) {
                hostsQueryString = "("
            } else {
                hostsQueryString = hostsQueryString + "|"
            }
            hostsQueryString = hostsQueryString + "host:'" + item + "'";
        });
    }
    if (hostsQueryString.length > 0) {
        hostsQueryString = hostsQueryString + ")";
    }
    return hostsQueryString;
}

function getQuery(attributes) {
    var interests = getInterests(attributes);
    var hosts = getHosts(attributes);
    var query = samples.financial_news_query;
    var pub_date = samples.pub_date;

    var filterValue = "";
    if( attributes.language ){
        filterValue = "language:" + attributes.language;
    }else{
        filterValue = "language:en";
    }
    if( filterValue.length > 0 ){
        filterValue = filterValue + "," + pub_date;
    }else{
        filterValue = pub_date;
    }
    if( interests.length > 0 ){
        if( filterValue.length > 0 ){
            filterValue = filterValue + "," + interests;
        }else{
            filterValue = interests;
        }
    }
    if( hosts.length > 0 ){
        if( filterValue.length > 0 ){
            filterValue = filterValue + "," + hosts;
        }else{
            filterValue = hosts;
        }
    }

    var queryObject = {};
    queryObject.query = query;
    queryObject.filter = filterValue;
    queryObject.deduplicate = attributes.deduplicate;
    queryObject.count = attributes.count;
    queryObject.return = attributes.return;
    //console.log("Full query in query builder = " + JSON.stringify(query));
    return queryObject;
}

//getQuery(samples.sample_attributes);
module.exports.getQuery = getQuery;