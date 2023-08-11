# Passwordless OTP-based authentication using Amplify and Cognito user pool

Creating an OTP based login page either to the given Phone number or email address using AWS Amplify and Cognito user pool. 

To fullfil the criteria an AWS Cognito user pool with a custom auth challenge flow involving three Lambda function triggers (plus one to auto-confirm the user’s phone number as username) has been created.


![2023-08-07_18-44-11-66213c22-71b6-4f0a-885a-300829149db6](https://github.com/afsalahammed/amplify_cognito_app/assets/97507771/06c9b0f4-1a22-4620-960c-7ec9a8fd95e5)


Additionally, Amazon SNS is used to send one-time codes to consumers via SMS text messages. 

The steps given below explain how the lambda functions work and trigger:

On the custom sign-up/sign-in page, the user can enter their phone number. It is subsequently routed to the AWS Cognito user pool.

The “Create Auth Challenge” Lambda function is called by the user pool. This Lambda function generates a secret login code and SMS transmits it to the user’s mobile device over Amazon SNS.

The user enters the recieved OTP into the custom sign-in page. The user pool will execute the “Verify Auth Challenge Response” Lambda function to verify the users’ responses.

The user pool invokes the “Define Auth Challenge” Lambda function to ensure the successful answering of the challenge and that no further necessity for challenges. 
The user pool now considers the user to be authorized and responds to the user with valid JSON Web Tokens (JWTs).

![1_B_uF6bcP0MlFrO4tsR4OJw](https://github.com/afsalahammed/amplify_cognito_app/assets/97507771/bc984ee1-b46e-4dfd-8bb8-8e1f7c86a786)

### Deploying the App using Amplify.

Following the steps will create a Continous Deployment pipeline. 

1.) Fork the repository to your GitHub or your repository.   

2.) Go to AWS Amplify and select Get Started under Amplify Hosting

![2023-08-07_16-57-45-93492ee8-4125-458d-be7e-88c3c30b35b5](https://github.com/afsalahammed/amplify_cognito_app/assets/97507771/825f6415-9c60-45b0-9534-d8298d011dae)


3.) Select GitHub or the repository you are using. (I am using AWS CodeCommit to deploy the app). You might have to login/give access to GitHub from your AWS account in the next step if using GitHub.

![2023-08-07_16-58-35e2ba1981-e2b6-472e-bafa-e04cf2166590](https://github.com/afsalahammed/amplify_cognito_app/assets/97507771/0fb29c7a-ac7f-48d8-852c-d2a105492631)


4.) On the next page create a service new role if there is no existing one. This is to give AWS Amplify to Allow Amplify Backend Deployment to access AWS resources on your behalf. 

![2023-08-07_17-06-43-2bd2f6c6-25b1-44c1-bf93-55220a6b3269](https://github.com/afsalahammed/amplify_cognito_app/assets/97507771/2e3fbb37-4584-4424-ab14-0f35f803364e)


5.) On the next page review the settings you have configured and select Save & Deploy. 

Now the App will be automatically provisioned, built, and deployed by AWS Amplify.

![2023-08-07_18-54-234e861b4f-7cc3-4ae8-b31b-73fea6549eb8](https://github.com/afsalahammed/amplify_cognito_app/assets/97507771/b0818746-1fff-4983-984e-b5dfa0b42648)


Docs:

https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html
https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html
https://docs.amplify.aws/start/getting-started/auth/q/integration/react/#bonus-use-amplify-ui-primitives