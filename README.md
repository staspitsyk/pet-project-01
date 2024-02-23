## Description

The purpose of the project is to gather in one place personal skills in server development. The project is containerized and fully covered with tests including API layer with functional tests, databases/kafka integration with integration tests, business logic layer with unit tests.

A NestJs Pet project, that is build with next technologies
- NestJs
- Databases
 1. PostgreSQL
 2. MongoDB
- Postgres migrations
- ORMs
 1. typeorm
 2. mongoose
- Message broker Kafka
- Docker compose
- REST API
- Validations
 1. class-validator
 2. joi
- Swagger
- GraphQL API
- GUIs
 1. pgadmin
 2. kafka-ui
 3. mongo-express
- Tests
 1. Docker compose
 2. Functional
 3. Integration
 4. Unit

## Installation

```bash
$ npm install
```

## Running the app

add .env in the root of the project, use example.env as an example

```bash
# development
docker compose build
docker compose up
npm run migration:run
```

## Test

add .env.test in the root of the project, use example.env as an example

```bash
# unit tests
$ npm run test:unit

# integration tests
$ npm run test:int

# functional tests
$ npm run test:func

# all tests
$ npm run test
```
