# Monkey and River Hackathon | Team 11

Hi! We're the ever-so-strong team 11 participating in the Monkey and River Hackathon 2025! This hackathon project built in less than 15 hours focuses on Travel Risk. This project is an example of an essential tool that can be used by both insurance companies and individuals looking to travel the world!

## Demo


## Architecture
For our architecture we decided to go with a simple client/server architecture. Not only does this help for a tight deadline, but also allows for a simple and easy-to-understand platform. Furthermore the code is also designed in such a way that it can run concurrently with a single command. Our server makes use of the singleton design pattern to prevent creating multiple instances of a DB connection or Express instance.

## Coding Standards
Little time to set these in place, but we managed to enforce Gitflow as well as CI for our unit tests. We also moved most of the logic to hooks, which allowed us to make each file have a single intent.
![alt text](image.png)

## Technologies
For our frontend, we went with React as most of us were familiar with it. Our backend made use of Node.js and Express. The API calls from the frontend were proxied in order to bypass potential CORS errors. Our MongoDB database is hosted on MongoDB Atlas and allowed us for quick prototyping with the powerful Mongoose modelling framework. Furthermore, for UI we used PrimeReact as a UI framework as well as TailwindCSS to customise the UI to our needs. As a development and build tool, we made use of Vite.

## Testing
[![codecov](https://codecov.io/gh/Thian0509/Monkey-RiverTeam11/graph/badge.svg?token=42T9E0VHTT)](https://codecov.io/gh/Thian0509/Monkey-RiverTeam11)
For testing we used Vitest as our framework of choice. Furthermore, we made use of CodeCov to track our code coverage on the `main` branch. As seen in the figure below, we tried to maximise the coverage by testing each file a bit.
![alt text](codecov.png)
We also tested the API endpoints on Postman
![alt text](postman.png)

### How to test
In order to run the tests, please follow the steps:
1. Run `cd client`
2. Run `npm install`
3. Run `npm run test` to get a coverage report

## User-centric Design
Our focus was to provide the user with a clean and easy-to-use interface. The UI framework really helped us sync up the styling across the app. This gives the user a sense of familiarity when visiting new pages. However, there are lot to be done in terms of UI, we tried to eliminate those components that might confuse the user.
<h2>Pages :</h2> <br>
<ol>
  <li><strong>Home</strong> <br> <p>Heatmap mapping countries to visit on trip and their risk level on a scale of 1-100</p> <br> <img width="1896" height="953" alt="image" src="https://github.com/user-attachments/assets/050ba343-088a-4d2e-8e91-5ed5ad65a7c5" /></li>
  <li><strong>About</strong> <br> <p>Brief description of group info</p><br><img width="927" height="527" alt="image" src="https://github.com/user-attachments/assets/aa687e9d-bb7b-4542-8ef5-7502aba52f62" />
</li>
  <li><strong>Account</strong> <br> <p>Account details to be edited here</p><br><img width="1882" height="943" alt="image" src="https://github.com/user-attachments/assets/e9bb32d9-2c83-4f69-93dc-dd854e82e2d1" />
</li>
  <li><strong>Authenticate</strong> <br> <p>This is both the log in and register form handling the needed logic for encoding passwords</p><br><img width="770" height="654" alt="image" src="https://github.com/user-attachments/assets/f4b4bacf-9b1f-47fb-a582-473385cde4b5" />
</li>
  <li><strong>Travel Risk</strong> <br> <p>A datatable where destinations can be added, removed and edited for a trip with the needed details like risk level</p> <br> <img width="1894" height="948" alt="image" src="https://github.com/user-attachments/assets/e23bd469-8484-4b35-9a1a-c012b468d1f3" /></li>
  <li><strong>Notifications</strong> <br> <p>This is a list of notifications for actions like register, log in, adding a destinations etc...</p> <br>
  <img width="1155" height="505" alt="image" src="https://github.com/user-attachments/assets/89537bf3-d954-42e1-be7b-1a41ff1d0331" /></li>
  
</ol>

## Meet the Team

- Iwan de Jong ([LinkedIn](https://linkedin.com/in/iwandejong), [GitHub](https://github.com/iwandejong))


