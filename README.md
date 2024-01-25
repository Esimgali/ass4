# Weather Forecast
Shows the weather in the city entered by the user

#Installation

Before running the project, ensure that all dependencies are installed. You can install them by executing the following command in the project root:
```bash
npm install
```

Running the Project on a Local Server
To run the project on a local server, follow these steps:
1) Start the server using nodemon:
```bash
node index.js
```
Now your project should be accessible at http://localhost:3000

# Used APIs in the Project
The project utilizes several APIs to enhance its functionality:

1)OpenWeatherMap API: Shows the weather in the city entered by the user.

2)Polygon.io API:Shows the ratio of two currencies entered by the user.

3)REST COUNTRIES API: Accepts a country code obtained using OpenWeather and returns country information.

# Project Structure
index.js: Receives data from the API and sends it to localhost.

app.js: Receives data from the server and modifies the DOM.

index.html: Main HTML file that defines the structure of the web page.
# Dependencies
The project uses Express.js, Bootstrap, Nodemon, https. Details in package.json



