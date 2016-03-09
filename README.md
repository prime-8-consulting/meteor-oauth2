## Meteor OAuth2

This is the root repository of several meteor packages that give your application the ability to act as an OAuth2 server or login to a OAuth2 Meteor application.

Checkout the packages for the package source. The examples will be very helpful in understanding what you can do with these packages.

=========================================
#### OAuth Flow - Diagram

![OAuthWebSequenceWithConfig](https://raw.githubusercontent.com/awatson1978/meteor-oauth2/readme-updates/documentation/OAuthWebSequenceWithConfig.png)

=========================================
#### OAuth Flow - Step By Step

```bash
C1         Request Client ID               
C1.1       Generate Client ID             
C1.2       Return Client ID               
C2         Configure Client ID               

A1         Start App                     
A1.1       Launch Browser                
A1.1.1.    Request Login                 
A1.1.1.1   Create Login Page             
A1.1.1.2   Return to Login Page          
A2         Enter Login Details           
A2.1       Submit Login Details          
A2.1.1     Authenticate User             
A2.1.2     Redirect to Application       
A3         Intercept Redirect            
A4         Extract Auth Code             
A5         Get Access Token              
A5.1       Return Access/Refresh Token   
A6         Save Refresh Token            
A7         Get Data                      
A7.1       Check Access Token           
A7.2       Return Data  
A8         Rest of Business Logic        
```


=========================================
#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
