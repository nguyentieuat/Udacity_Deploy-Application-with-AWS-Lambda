# Project: Serverless TODO Application
The project is based on the given environment variables in the **./client/.env** file as below:

```sh
REACT_APP_AUTH0_DOMAIN=dev-qtuqnwt0vs78ouex.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=XzvuBYqVEwcgIvRNTJe8QsNh1ED65NEZ
REACT_APP_API_ENDPOINT=https://e0yv7aleik.execute-api.us-east-1.amazonaws.com/dev
```
Please copy-paste the above variables to your ***./client/.env*** file

## I. Functionality

1. **The application allows users to create, update, delete TODO items**
  - Get TODO:
   ![Alt text](screenshots/get_TODO.png)

  - Create TODO: 
  ![Alt text](screenshots/create_TODO.png)

  - Update TODO: 
  ![Alt text](screenshots/update_TODO.png)

  - Delete TODO: 
  ![Alt text](screenshots/delete_TODO.png)


2. **The application allows users to upload a file.**
![Alt text](screenshots/upload_TODO.png)

3. **The application only displays TODO items for a logged in user.**
![Alt text](screenshots/console_info.png)

4. **Authentication is implemented and does not allow unauthenticated access.**
![Alt text](screenshots/unauthorized_TODO.png)

## II. Code Base

1. The code is split into multiple layers separating business logic from I/O related code.
![Alt text](screenshots/tree_source.png)

2. Code is implemented using async/await and Promises without using callbacks.

  - My backend source code is implemented with using async/await & promises without using any callback:
  ![Alt text](screenshots/asyncawait_func.png)


## III. Best Practice

1. All resources in the application are defined in the "serverless.yml" file

  - My backend source code provides all AWS resources via "serverles.yml" file.
  ![Alt text](screenshots/serverless.yml.png)

2. Each function has its own set of permissions.

  - Each functions in serverless.yml has own proper sets of permission:
  ![Alt text](screenshots/permission.png)


3. Application has sufficient monitoring.
  - Application logs are shown under CloudWatch's log groups with Winston's logs for troubleshooting
  ![Alt text](screenshots/log.png)

4. HTTP requests are validated
  ![Alt text](screenshots/validate.png)


## IV. Architecture

1. Data is stored in a table with a composite key.
  ![Alt text](screenshots/table_serverless.png)

2. Scan operation is not used to read data from a database.
  ![Alt text](screenshots/dynamoDbquery.png)
