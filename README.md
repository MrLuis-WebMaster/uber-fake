
# Uber Fake

A simulated taxi service for testing and learning.

## Run Locally

Clone the project

```bash
  git clone https://github.com/MrLuis-WebMaster/uber-fake
```

Go to the project directory

```bash
  cd uber-fake
```

Install dependencies

```bash
  npm install
```

Start the server prod mode

```bash
  npm start
```
Start the server dev mode

```bash
  npm run start:dev
```

Running seeders

```bash
npx sequelize-cli db:seed:all --url 'postgresql://your-username:your-password@localhost:5432/your-database-name'
```


## Running Tests

To run tests, run the following command

```bash
  npm run test
```

To run tests coverage, run the following command

```bash
  npm run test:cov
```


## Deployment

Install Railway CLI

```bash
  npm i -g @railway/cli
```

Shell Script (macOS, Linux, Windows via WSL)

```bash
  bash <(curl -fsSL cli.new)
```

Authenticating with the CLI

```bash
  railway login
```

Create a project

```bash
  railway init
```

Add Database Service
Select Postgrest Database

```bash
  railway add
```

Upload a project

```bash
  railway up
```

To complete the deployment setup, please log in to Railway, select the project with the name you provided using the CLI, go to settings, and configure environment variables, visibility, and any other parameters according to your needs.
