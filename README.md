<img width=50% src="https://github.com/kieranmakes/KWCRM/blob/crm-desktop-app/kwcrm-app/public/assets/word%20logo%20with%20abstract%20on%20side%20orange.png" alt='KWCRM'/>

<br>

An open source, web based customer relationship management system made into a desktop application

[Try out the CRM online in trial mode](https://kwcrm.herokuapp.com/)

<hr>

### Features

 #### ⏳ &nbsp;&nbsp; Task Scheduler
 
 <br>


  <img align="left" src="https://media.giphy.com/media/38UQZDj7URgZYAjS3t/giphy.gif">
  <br><br><br><br><br><br>
  
   Found in the Dashboard. Enter date, time, subject and message into the schedule task form and then it will display in chronological order in wither the today or future list.
    Once the task's date and time has lapsed, the task will be removed. The task can also be manually removed by clicking the trash icon.   
  
  

 
<br>

* #### 📁 &nbsp;&nbsp; Contacts List

  ![gif contacts list](https://media.giphy.com/media/zWDF26WkikllHPgJNc/giphy.gif)

    Search, sort, add and export (csv file) contacts. contacts displayed in a scrolable table with some of their data. individual contact page can be accessed by clicking the contacts name link.
  
<br>  
  
* #### 🙋🏽‍ &nbsp;&nbsp; Individual Contact Pages

  ![gif individual contact](https://media.giphy.com/media/8YWZoZXVFScOYYlOR7/giphy.gif)

    Displays all of the contact's data. allows for notes to be added to the contact which get displayed only on the individual contact's page along with the date the note was created put in chronological order (newest at the top).
    An extra notes section (Text Area) which allows you to encrypt and decrypt data with a password through the use of xor encryption for more sensitive data.
    Can edit and delete contact through this page by clicking on the relevant buttons.
  
<br>  
  
* #### 📊 &nbsp;&nbsp; Analytics Page

  ![gif analytics](https://media.giphy.com/media/BDQtWZzi6KknoGjTSf/giphy.gif)

    Shows graphs of clients gained and clients lost ove a monthly (last 12 months), weekly (last 12 weeks) and daily (last 14 days) time scale.
    Has a conversion rate (lead to client) output too that shows the conversion rate as both a ratio and a percentage.
    All of the Analytics data can be reset from this page too.


<hr> 

### How It Works

* Electron app src/index.js creates a browser window and runs the express app
* Express app kwcrm-app/index.js directory serves the site to localhost:8000
* Electron browser window loads up localhost:8000

<br>

* All data is stored in text files and a CSVHandler class is used to handle the searching, sorting and manipulation of the files
* Very minimal node packages have been used as it was made for a school coursework initially, so I avoided node packages wherever I could to write the code myself
