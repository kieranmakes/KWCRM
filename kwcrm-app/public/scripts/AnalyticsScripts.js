// store the graph canvas elements into variables
let clientsGained = document.querySelector('#clients-gained').getContext('2d');
let clientsLost = document.querySelector('#clients-lost').getContext('2d');


// // dummy test data for the graphs
// let clientsGainedLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// let clientsGainedDataPoints = [20, 32,34,45,43,35,24,21,14,12,19,16];
//
// let clientsLostLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// let clientsLostDataPoints = [20, 32,45,23,54,21,25,31,45,17,11,8];




// when time scale option gets selected the form's action gets changed to the selected option's id
function changeAction() {
    let timeScale = $('#time-scale').val();
    console.log(timeScale);
    document.querySelector("#time-scale-form").action = "/analytics/" + timeScale; // line that changes the action attribute of the time scale form

}




// creates the graph for clients gained using the chart.js library
let clientsGainedGraph = new Chart(clientsGained , {
    type: 'line',
    data: {
        labels: clientsGainedLabels,
        datasets:[{
            label:'Number Of Clients Gained',
            data: clientsGainedDataPoints,
            backgroundColor: 'lightgreen',
            borderWidth: 1,
            borderColor: '#777',
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Clients Gained',
            fontSize: 25,
        },
        legend:{
            display: false
        },
    }
});

// creates the graph for clients lost using the chart.js library
let clientsLostGraph = new Chart(clientsLost , {
    type: 'line',
    data: {
        labels: clientsLostLabels,
        datasets:[{
            label:'Number Of Clients Lost',
            data: clientsLostDataPoints,
            backgroundColor: 'lightcoral',
            borderWidth: 1,
            borderColor: '#777',
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Clients Lost',
            fontSize: 25,
        },
        legend:{
            display: false
        },
    }
});

// // creates the graph for number of clients using the chart.js library
// let numberOfClientsGraph = new Chart(numberOfClients , {
//     type: 'line',
//     data: {
//         labels: numberOfClientsLabels,
//         datasets:[{
//             label:'Number Of Clients',
//             data: numberOfClientsDataPoints,
//             backgroundColor: 'lightblue',
//             borderWidth: 1,
//             borderColor: '#777',
//         }]
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         title: {
//             display: true,
//             text: 'Number Of Clients',
//             fontSize: 25,
//         },
//         legend:{
//             display: false
//         },
//     }
// });