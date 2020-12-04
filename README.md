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

## Pre-requisites
* [IBM Cloud account](https://www.ibm.com/cloud/): Create an IBM Cloud account.
* [OpenShift Cluster](https://docs.openshift.com): You should have one OpenShift cluster, if you want to deploy your application on OpenShift.

# Steps

Please follow the below to setup and run this code pattern.

1. [Get the code](#1-get-the-code)
2. [Create IBM Cloud Services]
3. [Deploy on IBM Cloud]
4. [Deploy on OpenShift]
5. [Access your application and analyze the results]

### 1. Get the code

Clone the repository using the below command.

```
git clone https://github.com/IBM/k8-secrets-as-hyperledger-fabric-wallet.git
```

### 2. Create IBM Cloud Services

**Create Discovery Service**


**Create App ID service instance**

### 3. Deploy on IBM Cloud

#### 3.1 Deploy news API service

#### 3.2 Deploy user management service

#### 3.3 Deploy front-end service

### 4. Deploy on OpenShift

Login to OpenShift. From the IBM Cloud console go to `Clusters > Your OpenShift Cluster > OpenShift web console`. From the OpenShift web console click the menu in the upper right corner (the label contains your email address), and select Copy Login Command. Click on Display token and paste the command into a terminal session.   For example:
  ```
  oc login --token=xxxx --server=https://xxxx.containers.cloud.ibm.com:xxx
  ```
  
#### 4.1 Deploy news API service

#### 4.2 Deploy user management service

#### 4.3 Deploy front-end service

  ***Set the environment***

    ```
    $ cd front-end-service
    $ cp .env.sample .env
    ```

   Update the environment file(.env) with appropriate values.
   
  ***Deploy service***
  
   Navigate to the directory `front-end-service`.

    ```
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
    ```

  Need to update this callback URL in AppID as well. Go to `IBM Cloud dashboard -> Services -> <your AppID service> -> Manage Authentication`.
  Select `Authentication Settings` and in `Add web redirect URLs` section, add the following URL.

  ```
  http://<your-application-route>/callback
  ```

  Now you are all set to access your application.

### 6. Access your application and analyze the results

Access your application route `http://<your application-route>` on any browser.



