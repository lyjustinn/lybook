# lybook
REST api for the LyBook project that allows users to track item prices on Amazon.

### Depedencies for Development and Opertion

#### Dependecies:
* bcrypt: ^5.0.0
* cors: ^2.8.5
* cron: ^1.8.2
* dotenv: ^8.2.0
* express: ^4.17.1
* jsonwebtoken: ^8.5.1
* mongoose: ^5.11.8
* morgan: ^1.10.0
* passport: ^0.4.1
* passport-jwt: ^4.0.0
* passport-local: ^1.0.0
* puppeteer: ^5.5.0

#### Dev Depencies
* nodemon": ^2.0.6

### Installation

As of this moment, this server has not been deployed on Heroku.

#### Local Installation
1. Download the repostitory
2. If not done already, install [NodeJS](https://nodejs.org/en/ "Install NodeJS")
3. Run `npm install` in your terminal
4. Create a file in the top directory called `.env`
5. Create a MongoDB Atlas database
6. Add your connection string in the .env file like so: `MONGO_DB=YOUR_CONNECTION_STRING`
7. Run `npm start`in your terminal

### Potential Gotcha's

The server will automatically updated prices at an hour basis using cron jobs, however this update frequency can be adjusted if desired. However, this also means that the 
server must be run continually to keep updated prices in the database. 
