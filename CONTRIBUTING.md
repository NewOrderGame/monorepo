# Contributors Guide

First of all, thank you for the collaboration! 

> Contact [Artem Devlysh](mailto:artem@devlysh.com?subject=Regarding%20NOG) or [Ievgen Khudan](mailto:e.khudan@gmail.com?subject=Regarding%20NOG) to get more instructions.

## Environment

### Node.js version
Use Node.js 16.

We recommend using NVM to install the specified Node.js version.

You can find the node version in the `.nvmrc`

- Run the `nvm use` command in the project's root directory.

### Running local New Order Game

#### Setup for development

You'll need to set up the environment separately for each package

- Copy the `environment/.env.example` to `environment/.env.development` in each package which contains `environment` directory. 

> Ask [Artem Devlysh](mailto:artem@devlysh.com?subject=Regarding%20NOG%20dev%20environment%20variables) about environment variables which are indicated by `...`

> See list of required variables for each service in according `.env.example`

##### Backend services:

```shell
# Node environment
NODE_ENV="dev"

# Core Service port
NOG_PORT="5010"

# UI origin for CORS
NOG_UI_ORIGIN="http://localhost:3000"

# Core URL for services
NOG_CORE_URL="ws://localhost:5010"

# AWS Account ID
NOG_AWS_ACCOUNT_ID="..."

# User pool ID
NOG_USER_POOL_ID="..."

# User pool web client ID
NOG_USER_POOL_WEB_CLIENT_ID="..."

# Cognito region. We are based in Frankfurt
NOG_COGNITO_REGION="eu-central-1"

# Service secrets
NOG_LOCATION_SITE_BUILDER_SERVICE_SECRET="LOCATION_SITE_BUILDER_SERVICE_SECRET" # Should be equal for Location Site Service and Core
NOG_NPC_SERVICE_SECRET="NPC_SERVICE_SECRET" # Should be equal for NPC Service and Core Service
```

> There should be unique value for each core/service pair.

> During deployment, the secrets are being generated and stored in the AWS Secrets Manager automatically

> During development, the main thing is that they match in the configured service and Core Service to make it work

##### UI:

```shell
# Node environment
NODE_ENV="dev"

# Port for UI
NOG_PORT="3000"

# Core Service URL
REACT_APP_NOG_CORE_URL="http://localhost:5010"

# User pool ID
REACT_APP_NOG_USER_POOL_ID="..."

# User pool web client ID
REACT_APP_NOG_USER_POOL_WEB_CLIENT_ID="..."

# Cognito region. We are based in Frankfurt
REACT_APP_NOG_USER_POOL_REGION="eu-central-1"
```

#### Install the New Order Game

- Install yarn: `npm i -g yarn`

- Install node modules `yarn`

This will run `lerna` and install all required dependencies for all packages.

> You may take a look at `.nogrc` to see which services are going to run.

> Comment-out lines in `.nogrc` to exclude service from running list if requred.

- Build common module for the first time: `yarn workspace @newordergame/common build`

- For the development server with all services run: `yarn all`

- For the development server with packages from `.nogrc` run: `yarn dev`

Then you will see runtime log and if there are no errors check the game.

- Open this page in your browser and enjoy: [http://localhost:3000](http://localhost:3000)

## Code gide

### Adding dependencies

When you add dependency please make sure it is being used in single package.

If such dependency meets in other package, please move it to the root `$PROJECT_ROOT/package.json` and remove one in package.

## Links

- [Google Drive](https://drive.google.com/drive/folders/18vlsmhDxfZF5FtdXBN8FzpCZjwQK_ddi)
- [Trello board](https://trello.com/b/mW7EUTvz/new-order-game)
- [Telegram Group](https://t.me/+hgopmqpdSHgyNDZi)

> Ask [Artem Devlysh](mailto:artem@devlysh.com?subject=Regarding%20NOG%20cloud%20services%20access) to obtain access to Google Drive and Trello Board.

---

If you have any questions please don't hesitate to ask. Thank you!
