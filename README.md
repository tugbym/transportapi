# Project Hydra

Project Hydra is a one-for-all social media-based travel API. It aims to collate together information on buses, flights and trains. It allows users to add
themselves to a transport, and view their friends location.
Created using *Sails.js* and for deployment on *Modulus*.

## Run Locally
To install iTrailer on a local server, copy the following shell commands:

* Ensure you have installed node.js and npm
* Checkout the repository: `git clone https://github.com/tugbym/transportapi`
* Install dependencies: `npm install`

## Start the Server
To start the local server, first set the following environment variables:

Mongo credentials:
* `export MONGO_USERNAME=tugbym`
* `export MONGO_PASSWORD=Mongo4040`

Mandrill credentials:
* `export MANDRILL_USERNAME=projecthydra5050@hotmail.co.uk`
* `export MANDRILL_PASSWORD=PYhJuaAalFQLsQRBaCzoJQ`

Then start the server with the following command:
* `sails lift`

Note that this command will run the Grunt tasks, before launching.
To start in a production environment and run production tasks, use the following command:

* `sails lift --prod`

The website can be viewed on **http://localhost:3000/**

## Testing
To use the testing suite:

* `mocha`

## Remote Application
To view the live version of our application on Modulus, click [here](http://project-hydra-44013.onmodulus.net).

## Travis CI
To view the Travis repository, click [here](https://magnum.travis-ci.com/tugbym/transportapi).

## Hotmail Account
At one point during the OAuth2 procedure, an email will be sent through Mandrill to projecthydra5050@hotmail.co.uk.
You may view these emails with these credentials at hotmail:
* Email: projecthydra5050@hotmail.co.uk
* Password: Mongo4040

Alternatively, you may use your own email address and sign it up through Mandrill, setting up your own environment variables.

## Admin Account
In the API, there is an admin user who can access a Mongo frontend that no other user can.
This account can be authenticated on the remote application, as follows:
* Username: admin
* Password: Admin5050