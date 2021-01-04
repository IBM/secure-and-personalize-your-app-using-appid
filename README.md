*** Work in progress ***

# Add Security and User Personalization for an online Finance news portal using AppID

There are two important aspects for any application that you build - `Authentication and User Personalization`. 

If you take authentication on online platforms, the support for `Social login` is common now. The users can login to the online portal using their Google or Facebook accounts. This method of authentication is beneficial both for online portals and end users. There is increased consumption and usability as there is no need to create a separate account on every online portal for authentication. The trust in the security provided by social media login has been increasing too. 

The second aspect is user personalization. Many online portals have vast amount of information. The end user is interested only in certain areas of the information. User personalization can make the portal more consumable for an end user. Let us take the example of a online news portal. The news can be from the area of Politics, Entertainment, Science, Technology, Sports or Finance. An end user who is interested in Sports will have to filter through many articles before reading the article of interest. Here, user personalization can do the filtering task and present articles in the end users areas of interest.

In this code pattern, you will build an online financial news portal with social login and user personalization with AppID. The news portal will source articles from `Discovery News` collection. The end user can log in using their existing Google or Facebook accounts. After login, the user builds a profile specifying the areas of interest like Equity, Mutual Funds etc. The application filters the news content based on user profile and presents it to the end user for consumption.

When the reader has completed this Code Pattern, they will understand how to:
* Add social login to an application with AppID
* Build user profile with AppID
* Get financial news from discovery news collection using Discovery query language
* Add user personalization to filter news articles based on user profile

## Flow

![arch](images/architecture.png)

1. User accesses the `App UI` rendered by the `Front-End` service
2. The `App UI` sends the request to the `Front-End` service
2. The `Front-End` service fetches the finance news from `News` service. The `News` service sources the news from `Watson Discovery News` which is displayed on the `App UI`
3. User logins to the portal through the `Front-end` service using social sign-in powered by App ID
4. User sets preferences through the `Front-end` service which invokes the `User management` service with the preferences
5. The `User management` service then sets the user profile on App ID  
6. After sign-in, the `Front-End` service invokes the `News` service for finance news 
7. The `News` service retrieves the user's profile and preferences from App ID
8. The `News` service returns personalized news sourced from `Watson Discovery News` based on the user's profile
9. User can update his preferences and then application shows personalized news based on the new preferences 

## Pre-requisites

* [IBM Cloud account](http://cloud.ibm.com/): Create an IBM Cloud account.
* [Install ibmcloud CLI](https://cloud.ibm.com/docs/cli?topic=cli-install-ibmcloud-cli)
* [OpenShift Cluster](https://docs.openshift.com): You should have one OpenShift cluster, if you want to deploy your application on OpenShift.
* [Install oc CLI](https://cloud.ibm.com/docs/openshift?topic=openshift-openshift-cli#cli_oc)

# Steps

Please follow the below to setup and run this code pattern.

 1. [Get the code](#1-get-the-code)  
 2. [Create IBM Cloud Services](#2-create-ibm-cloud-services) 
 3. [Configure AppID](#3-configure-appid)
 4. [Deploy Application](#4-deploy-application)  
    4.1 [Deploy on Cloud Foundry](#41-deploy-on-cloud-foundry)  
    4.2 [Deploy on OpenShift](#42-deploy-on-openshift)
 5. [Access your application and analyze the results](#5-access-your-application-and-analyze-the-results)  

### 1. Get the code

Clone the repository using the below command.

```
git clone https://github.com/IBM/secure-and-personalize-your-app-using-appid.git
```

### 2. Create IBM Cloud Services

**Create Discovery Service**

Login to [IBM Cloud](https://cloud.ibm.com) . 

Click on `Catalog` in top menu bar. Under `IBM Cloud products` search for `Discovery`. Click on `Discovery` tile that gets listed.

Select `Lite` plan, if not already selected, then click `Create` to create an instance of Watson Discovery service. When Discovery instance is created in a minute or two, make a note of `Service credentails` in a text file. These will be needed in later steps.

![image-20201210155703629](./images/image-20201210155703629.png)



**Create App ID service instance**

Login to [IBM Cloud](https://cloud.ibm.com) . 

Click on `Catalog` in top menu bar. Under `IBM Cloud products` search for `App ID`. Click on `App ID` tile that gets listed.

Select `Lite` plan, if not already selected, then click `Create` to create an instance of App ID. When App ID instance is created, make a note of service credentials. If service credentials are not available by default, you can create new credentials as shown.

![image-20201211165207271](./images/appid-credentials.png)

Make a note of `Service credentials` in a text file. These will be needed in later steps.

### 3. Configure AppID

Access the AppID service instance using IBM Cloud dashboard. Select `Manage Authentication` in left panel menu. It shows the list of `Identity Providers`. We are using social sign-in using Facebook and Google only in this code pattern, hence disable other identity providers except Facebook and Google. The changes will get saved automatically.

Next, go to `Login Customization` in left panel menu. Using this you can customize your login page.

***Upload Logo***. You can choose any image of your choice as a logo of your login page. In this code pattern, App ID logo itself is being used and provided for your ease in `images` folder of the repository.

***Header Color***. You can choose any color for the header or provide hex code of the color directly. For example, give hex color code as #181818 for black color header.

***Tab Name***. You can add any name as tab name of your choice.

Once done, click on `Save Changes`.


### 4. Deploy Application

  ### 4.1 Deploy on Cloud Foundry

  Login to IBM Cloud using the following command.

  ```
ibmcloud login [--sso]
  ```

   #### 4.1.1 Deploy News service

   ***Set the environment***

    $ cd news-api-service
    $ cp .env.sample .env

   Update the environment file(.env) with appropriate values from the credentials data noted in `**Create Discovery Service**` section.

   ***Deploy service***

   Navigate to the directory `news-api-service`.

    $ cd news-api-service
    $ ibmcloud cf push <your-app-name>
    
    ## Get your application URL
    $ ibmcloud cf apps

Make a note of this `News` Service URL. This will be used in later steps.


   #### 4.1.2 Deploy user management service

   ***Set the environment***
    
    $ cd user-management-service
    $ cp .env.sample .env

   Update the environment file(.env) with appropriate values.

   ***Deploy service***

   Navigate to the directory `user-management-service`.

    $ cd user-management-service
    $ ibmcloud cf push <your-app-name>
    
    ## Get your application URL
    $ ibmcloud cf apps

   Make a note of this User Management Service application URL. This is needed in below steps.

   #### 4.1.3 Deploy front-end service

   ***Set the environment***

    $ cd front-end-service
    $ cp .env.sample .env

   Update the environment file(.env) with appropriate values of App ID credentials and URL of previously deployed services.

   ***Deploy service***

   Navigate to the directory `front-end-service`.

    $ cd front-end-service
    $ ibmcloud cf push <your-app-name>
    
    ## Get your application URL
    $ ibmcloud cf apps

   Make a note of this Front End Service application URL. This is needed in next step.

   ***Update Callback URL in App ID***

   Go to `IBM Cloud dashboard -> Services -> <your AppID service> -> Manage Authentication`.

   ![add-callback-url](./images/appid-snapshot.png)

   Select `Authentication Settings` and in `Add web redirect URLs` section, add the following URL.

   ```
   https://<your-front-end-service-application-url>/callback
   ```

   Now you are all set to access your application.


  ### 4.2 Deploy on OpenShift

   Login to OpenShift. From the IBM Cloud console go to `Clusters > Your OpenShift Cluster > OpenShift web console`. From the OpenShift web console click the menu in the upper right corner (the label contains your email address), and select Copy Login Command. Click on Display token and paste the command into a terminal session. For example:
  ```
  oc login --token=xxxx --server=https://xxxx.containers.cloud.ibm.com:xxx
  ```

   #### 4.2.1 Deploy News service

   ***Set the environment***

    $ cd news-api-service
    $ cp .env.sample .env

   Update the environment file(.env) with appropriate values.

   ***Deploy service***

   Navigate to the directory `news-api-service`.

    $ cd news-api-service
    $ oc new-app --name=<your-app-name> .
    $ oc start-build <your-app-name> --from-dir=.
    
    ## build status can be checked using following command
    $ oc logs -f bc/<your-app-name>
    
    ## app deployment status can be checked using below command
    $ oc status        # it should show that 1 pod is deployed for your app
    
    $ oc expose svc/<your-app-name>
    $ oc get routes <your-app-name>  ## copy full route for next step

   Make a note of this News API Service application URL. This is needed in below steps.

   #### 4.2.2 Deploy user management service

   ***Set the environment***

    $ cd user-management-service
    $ cp .env.sample .env

   Update the environment file(.env) with appropriate values.

   ***Deploy service***

   Navigate to the directory `user-management-service`.

    $ cd user-management-service
    $ oc new-app --name=<your-app-name> .
    $ oc start-build <your-app-name> --from-dir=.
    
    ## build status can be checked using following command
    $ oc logs -f bc/<your-app-name>
    
    ## app deployment status can be checked using below command
    $ oc status        # it should show that 1 pod is deployed for your app
    
    $ oc expose svc/<your-app-name>
    $ oc get routes <your-app-name>  ## copy full route for next step

   Make a note of this User Management Service application URL. This is needed in below steps.

   #### 4.2.3 Deploy front-end service

   ***Set the environment***

    $ cd front-end-service
    $ cp .env.sample .env

   Update the environment file(.env) with appropriate values with appropriate values of App ID credentials and URL of previously deployed services.

   ***Deploy service***

   Navigate to the directory `front-end-service`.

    $ cd front-end-service
    $ oc new-app --name=<your-app-name> .
    $ oc start-build <your-app-name> --from-dir=.
    
    ## build status can be checked using following command
    $ oc logs -f bc/<your-app-name>
    
    ## app deployment status can be checked using below command
    $ oc status        # it should show that 1 pod is deployed for your app
    
    $ oc expose svc/<your-app-name>
    $ oc get routes <your-app-name>  ## copy full route for next step
    
    # this route will be used by AppID for callback URL, so lets update deployment config before accessing the application
    $ oc set env dc/<your-app-name> APPLICATION_URL=http://<your-application-route>

   Make a note of this Front End Service application URL. This is needed in next step.

   ***Update Callback URL in App ID***

   Go to `IBM Cloud dashboard -> Services -> <your AppID service> -> Manage Authentication`. 

   ![add-callback-url](./images/appid-snapshot.png)

   Select `Authentication Settings` and in `Add web redirect URLs` section, add the following URL.

   ```
   http://<your-application-route>/callback
   ```

   Now you are all set to access your application.

> Note: Hybrid mode of deployment (some services on Cloud foundry and some on OpenShift) is also possible. You can choose the deployment strategy as per your requirement. 

### 5. Access your application and analyze the results

Access your front end service URL on any browser. You can explore the application as shown here.

[![](https://i9.ytimg.com/vi/aQEaWcUePOk/maxresdefault.jpg?time=1609758900000&sqp=CLTxy_8F&rs=AOn4CLDdIitsnO15eDOieeIIE-CYZvch6Q)](https://youtu.be/aQEaWcUePOk "Demo Video")

In this application, 
* Generic News API service returns top 10 finance news of the last three days. This configuration can be changed in News API service.
* Application uses only Facebook and Google sign-in. Other ways of authentication can also be explored in App ID and used as per the requirement.
* From the user's social media profile, this application uses user's name only. There are other attributes which can be used for personalization in the application. The user's email id can be used for email notification in the application. You may use user's photo as well retrieved from Facebook profile.
* Personalized News API service returns top 10 finance news of the last seven days. It is defined in News API service.

## Learn More

* [Explore AppID](https://cloud.ibm.com/docs/appid)
* [Learn more about IBM Cloud Security Services](https://cloud.ibm.com/catalog?category=security#services)
* [Build Nodejs Services with AppID](https://cloud.ibm.com/docs/appid?topic=appid-web-node)

## License

This code pattern is licensed under the Apache Software License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1 (DCO)](https://developercertificate.org/) and the [Apache Software License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache Software License (ASL) FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
