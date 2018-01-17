# Prompt

## Build a browser based web application that:
* Allows customers to upload an image along with a unique code (assume the code is provided to the customer via email request)

* Exposes a RESTful API for interacting with the application.

## Build a second browser based web application that:

* Interacts with the first web application through the created RESTful API and provides admins a screen to review the uploaded images alongside customer data (e.g. name, address, date of birth, etc.) retrieved with the unique code provided with the image. The admin should be able to indicate approval or denial of the image and provide notes on the reason.

* Status of the approvals/denials and email requests/uploads should be viewable and searchable from the admin application.
The solution should include a working CI/CD Pipeline in AWS using Docker containers and all of the code necessary to run the application and pipeline should be stored in GIT. Please provide the government with the credentials to access the code for review and test purposes. Additionally, please provide the government access to artifacts showing the workflow used to achieve the solution (e.g. Kanban Board, Scrum artifacts, etc.)

# Development

1. Use `.env.sample` to create a `.env` file with your AWS credentials.
2. Run `docker-compose build` to build the containers with dependencies, then `docker-compose run` to start the application.  The frontend should be served at http://localhost:3000.
