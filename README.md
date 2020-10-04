<img width=50% src="https://github.com/kieranmakes/KWCRM/blob/crm-desktop-app/kwcrm-app/public/assets/word%20logo%20with%20abstract%20on%20side%20orange.png" alt='KWCRM'/>
An open source, web based customer relationship management system made into a desktop application

<hr>

### Features

* #### Task Scheduler
  Found in the Dashboard. Enter date, time, subject and message into the schedule task form and then it will display in chronological order in wither the today or future list.
  Once the task's date and time has lapsed, the task will be removed. The task can also be manually removed by clicking the trash icon.
  
* #### Contacts List
  Search, sort, add and export (csv file) contacts. contacts displayed in a scrolable table. individual contact page can be accessed by clicking the contacts name link.
  





### How It Works

* Electron app src/index.js creates a browser window and runs the express app
* Express app kwcrm-app/index.js directory serves the site to localhost:8000
* Electron browser window loads up localhost:8000

<br>

* All data is stored in text files and a CSVHandler class is used to handle the searching, sorting and manipulation of the files
* Very minimal node packages have been used as it was made for a school coursework initially, so I avoided node packages wherever I could to write the code myself
