<h1 align="center">Movie-Buzz <img src="./client/src/assets/images/favicon.png" width="40" height="40"/></h1>
<p align="center">
    An online movie ticket booking web application with full admin support and having all real time booking functionalities like real booking apps & also interactive and beautiful user interface built with <a href="https://www.mongodb.com/mern-stack" target="_blank">MERN</a> stack
</p>

<br>

<h3 align="center">⬇️ Live project link ⬇️
<br>
<a href="https://moviebuzz-uttam1712.vercel.app" target="_blank">Vercel deployment 🔗</a>
</h1>

<br>

# Overview 📑

Movie-Buzz allows users to order tickets for a show and gather information about movies and venues. To purchase show tickets, the customer must first register to the application. When selecting a show, the user is presented with a seating configuration from which he can select seats. He'll be redirected to the payment input screen.
After completing the payment a ticket mail will be sent to the user email address with ticket details.
The suggested application allows users to reserve a movie from a theatre for a specific date & time. The user can display their booking history as a theatre ticket, saving time.

<br>

# Features ⭐

## Customer Features 🪄

-   [x] Register themselves
-   [x] Login to the application
-   [x] View currently released & coming soon movies
-   [x] Search movie
-   [x] Get movie details
-   [x] Watch movie trailer
-   [x] Get list of available shows for a particular movie
-   [x] Sort list of shows price & date wise
-   [x] View available & booked seats from seatmap (seat configuration)
-   [x] Select seat from available seats & get total price.
-   [x] Get ticket on mail after booking
-   [x] View booking history
-   [x] Give their feedback

<br>

## Admin Features ⚙️

-   [x] Login to admin panel
-   [x] View list of added movies
-   [x] Add new movie
-   [x] Delete movie from list
-   [x] View list of added shows
-   [x] Add new show
-   [x] Update show details
-   [x] View shows history
-   [x] Get show analytics (like earnings, available seats, booked seats, etc.)
-   [x] Add & delete cinema hall
-   [x] View list of customer feedbacks & load older feedbacks

## Common Features

-   [x] Forgot password
-   [x] Reset password
-   [x] Login
-   [x] Logout
-   [x] Pagination, searching & sorting

<br>
<br>

# Technologies Used 💻

<br>

## Backend

<br>

<div align="left">
<img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg" alt="Node.js"/> 
<img src="https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg" alt="Mongodb"/>
<img src="https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg" alt="Express.js"/>
</div>
<br>

-   [Node.js](https://nodejs.org/) for building backend & web server.
-   [Express.js](https://expressjs.com/) for building REST API.
-   [MongoDB](https://www.mongodb.com/docs/) as a database to store user information & chats.

## Frontend

<br>
<div align="left">
<img src="https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg"  alt="React.js"/> 
<img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-ar21.svg" alt="Tailwind.css" /> 
<img src="https://www.vectorlogo.zone/logos/axios/axios-ar21.svg" alt="axios" />

</div>
<br>

-   [React.js](https://reactjs.org/) for user interface.
-   [Context API](https://reactjs.org/docs/context.html) to manage state of application.
-   [Axios](https://axios-http.com/) for client side data fetching & api handling.
-   [Tailwind CSS](https://tailwindcss.com/) to give custom styling to all components.
-   [Vite](https://vitejs.dev/) for managing frontend development environment.

<br>

## Deployment 🌨️

<br>
<div align="left">
<img src="https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-ar21.svg"  alt="AWS"/>
</div>
<br>

-   This web app is hosted on [ec2](https://aws.amazon.com/ec2/?nc2=h_ql_prod_fs_ec2) instance of [aws](https://aws.amazon.com/) cloud
-   Movie media ( images ) is managed on [s3 bucket](https://aws.amazon.com/s3/) storage.
-   Database is hosted on [mongodb atlas](https://www.mongodb.com/atlas/database) cloud platform
-   [pm2](https://pm2.keymetrics.io/) is used for node process management on ec2
-   [Nginx](https://www.nginx.com/) is used as a web server, which serves frontend on port 80

<br>

# FAQ

#### How can I see admin panel ?

\*\* Admin panel is not accessible for everyone, if someone want to take a look on admin panel implementation he/she needs admin credentials, for that reach me on [pateluttam171210@gmail.com](mailto:pateluttam171210@gmail.com), I'll share.
