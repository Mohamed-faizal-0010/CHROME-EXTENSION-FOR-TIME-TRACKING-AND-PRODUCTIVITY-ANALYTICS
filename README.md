# CHROME-EXTENSION-FOR-TIME-TRACKING-AND-PRODUCTIVITY-ANALYTICS

*COMPANY*: CODTECH IT SOLUTIONS

*NAME*: S.KALISHWARAN

*INTERN ID*:CT04DZ460

*DOMAIN*: FULL STACK WEB DEVELOPMENT

*DURATION*: 4 WEEKS

*MENTOR*: NEELA SANTHOSE

*DESCRIPTION*:
   Simplified Steps to Get the Project Running

Here are the most critical actions you need to take. Use the code from the previous response for each file.

  *  Create the Folder Structure: Make one main folder, for example, ProductivityTrackerProject, and put these two folders inside it:

        ProductivityTrackerBackend

        ProductivityTrackerExtension

 *   Set Up the Backend:

        Open your terminal/command prompt.

        Navigate to the ProductivityTrackerBackend folder.

        Run npm install express mongoose cors chart.js. This downloads all the necessary packages.

        Create a file named server.js and paste all the backend code into it.

 *   Set Up the Extension (Frontend):

        Inside the ProductivityTrackerExtension folder, create a new folder called lib.

        Copy the chart.umd.min.js file from ProductivityTrackerBackend/node_modules/chart.js/dist/ and paste it into your lib folder.

        Create all the other required files in the ProductivityTrackerExtension folder: manifest.json, background.js, popup.html, popup.js, dashboard.html, and dashboard.js.

        Create an icons folder and place 16x16, 48x48, and 128x128 pixel images inside it.

 *   Run the Backend Server:

        Open a new terminal window.

        Navigate to the ProductivityTrackerBackend folder.

        Run the command node server.js.

        Crucially, check that the terminal says "MongoDB Connected!" and "Server running on port 5000".

   * Load the Chrome Extension:

        Open your Chrome browser and go to chrome://extensions.

        Enable "Developer mode" in the top right.

        Click "Load unpacked".

        Select the ProductivityTrackerExtension folder.

Now, you can browse some websites, then click the extension icon and "View Dashboard" to see your data.

Explanation of Technologies Used

This project uses a "full-stack" approach, meaning it combines both a front end (what you see) and a back end (the server and database). Here is a simple explanation of what each piece does:

1. The Back End (Server)

    Node.js: Think of Node.js as the engine that allows us to run JavaScript code on a computer server instead of in a web browser. It is the core platform for our entire back end.

    Express.js: This is a framework that makes writing the server code much easier. If Node.js is the engine, Express is the car's chassis and body, providing a ready-made structure to build upon so we don't have to start from scratch.

    MongoDB: This is our database, like a digital filing cabinet. It's where all the tracked activity data (like which website was visited and for how long) is permanently stored.

    Mongoose: This is a tool that helps our Node.js server talk to the MongoDB database easily. It's like a librarian who helps us organize our data and find what we need in the filing cabinet without having to know the complex language of the database itself.

2. The Front End (Extension & Dashboard)

    Chrome Extension APIs: These are special, built-in features that allow our code to interact with the Chrome browser. They let us do things like see which tab is active, get its URL, and save data to the browser's storage. They are the controls (like the steering wheel and pedals) that let our code "drive" the browser.

    Chart.js: This is a powerful JavaScript library used to create charts and graphs. Instead of having to draw every bar and line ourselves, Chart.js provides a toolkit that makes it simple to turn our raw data into the beautiful, interactive visualizations on our dashboard.

    HTML, CSS, & JavaScript: These are the fundamental building blocks of all websites and extensions. HTML provides the structure (the text and buttons), CSS makes it look good (the colors and layout), and JavaScript adds all the interactivity (the logic and actions).

*OUTPUT:

<img width="1201" height="586" alt="Image" src="https://github.com/user-attachments/assets/1b996462-047a-4887-9317-375f3556300e" />
<img width="1202" height="586" alt="Image" src="https://github.com/user-attachments/assets/128b26f7-fda9-41e2-9bf0-0b65929cc2a5" />
<img width="1366" height="768" alt="Image" src="https://github.com/user-attachments/assets/77529b07-d243-4fda-bacd-caa7c0d32631" />
<img width="1366" height="768" alt="Image" src="https://github.com/user-attachments/assets/86427c86-d0d1-4b64-ac57-3c580212ad96" />
<img width="1366" height="768" alt="Image" src="https://github.com/user-attachments/assets/19827ac1-a89b-40a8-9be8-733960870e39" />
