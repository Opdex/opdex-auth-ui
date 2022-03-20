# Opdex Auth UI

Opdex Auth UI repository. Angular with Typescript styled with Material and SCSS connected with the Opdex Auth API.

## Install Dependencies

```shell
npm install
```

## Environments

The UI operates on Devnet, Testnet or Mainnet. Configure the `environment.ts` file for local development and for deployments.

*Devnet is internal only, Testnet is public and Mainnet are public.*

## Run

Run the app locally by default on `http://localhost:4200`.

```shell
# Devnet (internal only)
ng serve

# Testnet (public)
ng serve -c testnet

# Mainnet (public)
ng serve -c mainnet
```

## Build

Build the project for development or a release.

```shell
# Devnet Build
ng build 

# Testnet Build
ng build -c testnet

# Mainnet Build
ng build -c mainnet

# Release Build
ng build -c prod
```

## Test

Run all of the project's unit tests.

```shell
ng test
```
