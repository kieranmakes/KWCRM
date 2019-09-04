

## READ ME


Ensure you open the website in the google chrome web browser and that it is viewed on a high resolution display.

Due to the system relying on time in some instances, data may get deleted and so you may need to populate the database

This might need to be done in the scheduled tasks page by entering data in with the current date with a future time to get data showing in the today list and with a future date to get data to show in the future list. 

This might also have to be done in the Analytics page to get the graphs to show data and to get the conversion rate to calculate the conversion rate for the month. To do this, just click the lead lost, client lost, and client gained buttons.

I am aware that when running the analytics page on a local machine, it will not seem to do anything to the graphs, however the live website does not seem to be affected by this bug as it works as expected on there. 

Contacts can't be deleted on the live website version however deleting contacts works when running it locally. 


# ~~~~ To Run Site From URL ~~~~~


Copy and paste the url in this directory into the google chrome web browser search bar at the top of the screen.


# ~~~~ To Run Site Locally ~~~~~


1) install node js onto your machine
  link: https://nodejs.org/en/

2) Test Node. To see if Node is installed, open the Windows Command Prompt, Powershell or  Bash Terminal, and type node -v. This should print a version number

3) Test NPM. To see if NPM is installed, type npm -v in Terminal. This should print NPM’s version number

3) To run the site, 'cd' or 'move' into the root directory (directory containing index.js and  package.json)

4) Enter the following command: 

  node index.js

5) A message should get returned to the CLI "you are using *port number*" with the port number that the site is being hosted on where I placed the *port number*

6) Open the google chrome browser and enter localhost:8080 but change the 8080 for whatever port was returned to the console.

7) if an error occurred it is likely due to that port already being used by something else. To change the port the site is being hosted on, open the index.js file in a text editor and at the very bottom where there is a function called "app.listen()" change the first parameter to another port number 8000, 8010, 8009, etc.. save the file and follow the steps again.

