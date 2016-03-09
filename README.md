## Meteor OAuth2

This is the root repository of several meteor packages that give your application the ability to act as an OAuth2 server or login to a OAuth2 Meteor application.

Checkout the packages for the package source. The examples will be very helpful in understanding what you can do with these packages.

=========================================
#### OAuth Flow - Diagram

![OAuthWebSequenceWithConfig](https://raw.githubusercontent.com/awatson1978/meteor-oauth2/readme-updates/documentation/OAuthWebSequenceWithConfig.png)

=========================================
#### OAuth Flow - Step By Step


````bash
C1        Request Client ID             #
C1.1      Generate Client ID            #
C1.2      Return Client ID              #
C2        Configure Client ID           #   

1         Start App                     # Meteor.startup()
1.1       Launch Browser                #
1.1.1.    Request Login                 #
1.1.1.1   Create Login Page             #
1.1.1.2   Return to Login Page          #
2         Enter Login Details           #
2.1       Submit Login Details          #
2.1.1     Authenticate User             #
2.1.2     Redirect to Application       #
3         Intercept Redirect            #
4         Extract Auth Code             #
5         Get Access Token              #
5.1       Return Access/Refresh Token   #
6         Save Refresh Token            #
7         Get Data                      #
7.1       Check Access Token            #
7.2       Return Data                   #
8         Rest of Business Logic        #
````


=========================================
#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
