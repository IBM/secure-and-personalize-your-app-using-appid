# Short title

Add authentication using social login and personalize user content

# Long title

Add Security and User Personalization for an online Finance news portal using AppID

# Author

* Shikha Maheshwari <shikha.mah@in.ibm.com>
* Muralidhar Chavan <muralidhar.chavan@in.ibm.com>
* Balaji Kadambi <bkadambi@in.ibm.com>

# URLs

### Github repo

* GitHub URL - https://github.com/IBM/secure-and-personalize-your-app-using-appid

### Other URLs

* Video URL
* Demo URL - https://www.youtube.com/watch?v=aQEaWcUePOk

# Summary

In any application, authentication and personalization are important aspects. This code pattern demonstrates how authentication using social login and user personalization can be added to any application using App ID.

# Technologies

* [Security](https://developer.ibm.com/solutions/security/)
* [Containers](https://developer.ibm.com/technologies/containers/)
* [NodeJS](https://developer.ibm.com/languages/node-js/)

# Description

There are two important aspects for any application that you build - Authentication and User Personalization.

If you take authentication on online platforms, the support for Social login is common now. The users can login to the online portal using their Google or Facebook accounts. This method of authentication is beneficial both for online portals and end users. There is no need to create a separate account on every online portal for end-users. This leads to increased consumption for online portals. The trust in the security provided by social media login has been increasing too.

The second aspect is user personalization. Many online portals have vast amount of information. The end user is interested only in certain areas of the information. User personalization can make the portal more consumable for an end user. Let us take the example of a online news portal. The news can be from the area of Politics, Entertainment, Science, Technology, Sports or Finance. An end user who is interested in Sports will have to filter through many articles before reading the article of interest. Here, user personalization can do the filtering task and present articles in the end users areas of interest.

In this code pattern, you will build an online financial news portal with social login and user personalization with AppID. The news portal will source articles from Discovery News collection. The end user can log in using their existing Google or Facebook accounts. After login, the user builds a profile specifying the areas of interest like Equity, Mutual Funds etc. The application filters the news content based on user profile and presents it to the end user for consumption.


# Flow

![arch](images/architecture.png)

1. User accesses the `App UI` rendered by the `Front-End` service
2. The `App UI` sends the request to the `Front-End` service
3. The `Front-End` service fetches the finance news from `News` service. The `News` service sources the news from `Watson Discovery News` which is displayed on the `App UI`
4. User logins to the portal through the `Front-end` service using social sign-in powered by App ID
5. User sets preferences through the `Front-end` service which invokes the `User management` service with the preferences
6. The `User management` service then sets the user profile on App ID  
7. After sign-in, the `Front-End` service invokes the `News` service for finance news 
8. The `News` service retrieves the user's profile and preferences 
9. The `News` service returns personalized news sourced from `Watson Discovery News` based on the user's profile
10. User can update his preferences and then application shows personalized news based on the new preferences 


# Instructions

When the reader has completed this code pattern, they will understand how to:
* Add social login to an application with AppID
* Build user profile with AppID
* Get financial news from discovery news collection using Discovery query language
* Add user personalization to filter news articles based on user profile
    

# Components and services

* [Red Hat OpenShift on IBM Cloud](https://developer.ibm.com/components/redhat-openshift-ibm-cloud/)
* [IBM Cloud](https://developer.ibm.com/components/cloud-foundry/)
* [App ID](https://cloud.ibm.com/catalog/services/app-id)
* [Discovery](https://cloud.ibm.com/catalog/services/discovery)
* [Security](https://developer.ibm.com/solutions/security/)

# Runtimes

* NodeJS

# Related IBM Developer content

* [Secure a Spring Boot application with App ID](https://developer.ibm.com/tutorials/secure-a-spring-boot-application-with-app-id/): Use the App ID Spring Boot Starter to leverage IBM Cloud App ID in your apps.

# Related links

* [Explore AppID](https://cloud.ibm.com/docs/appid)
* [Learn more about IBM Cloud Security Services](https://cloud.ibm.com/catalog?category=security#services)
* [Build Nodejs Services with AppID](https://cloud.ibm.com/docs/appid?topic=appid-web-node)


