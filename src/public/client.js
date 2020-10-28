var edited = false;
backupCheck();

$(document).ready(function () {
    searchTableCreate();
});

function backupCheck() {
    var url = "http://localhost:3000/checkBackup";
    $.get(url, function (data) {
        if(data == true){
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
            var span = document.getElementsByClassName("close")[0];
            span.onclick = function () {
                console.log("Called3");
                var url = "http://localhost:3000/noBackup";
                $.get(url)
                modal.style.display = "none";
            }
            $("#backupNo").click(function(){
                console.log("Called2");
                console.log("No");
                var url = "http://localhost:3000/noBackup";
                $.get(url);
                modal.style.display = "none";
            });
            $("#backupYes").click(function(){
                var url = "http://localhost:3000/getBackup";
                $.get(url);
                console.log("YES");
                modal.style.display = "none";
            });
        }
        else{
            console.log("Called1");
            var url = "http://localhost:3000/noBackup";
            $.get(url);
        }
    });

}




function searchTableCreate() {
    var sendKey;
    var sendField;
    $("#submit").click(function () {
        sendKey = $("#searchBar").val();
        sendField = $("#data_selection").val();
        console.log(sendField);
        if (sendKey) {
            console.log("button", sendKey);
            var url = "http://localhost:3000/search?field=" + sendField + "&id=" + sendKey;
            $.get(url, function (data) {
                var parent = document.getElementById('table');
                parent.innerHTML = "";
                if (data.length == 0) {
                    var _table_ = document.createElement('table');
                    _table_.innerHTML = "No Data Found, Check Spelling."
                    parent.appendChild(_table_)
                } else {
                    //ProcessData(data);
                    parent.appendChild(buildHtmlTable(data.slice(0, 100)));
                }
            });
        } else {
            var parent = document.getElementById('table');
            parent.innerHTML = "";
            var _table_ = document.createElement('table');
            _table_.innerHTML = "Please Enter A Keyword!"
            parent.appendChild(_table_)
        }

        console.log('output');
    });
}

var _table_ = document.createElement('table'),
    _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');

// Builds the HTML Table out of myList json data from Ivy restful service.
 function buildHtmlTable(arr) {
     var table = _table_.cloneNode(false),
         columns = addAllColumnHeaders(arr, table);
     for (var i=0, maxi=arr.length; i < maxi; ++i) {
         var tr = _tr_.cloneNode(false);
         for (var j=0, maxj=columns.length; j < maxj ; ++j) {
             var td = _td_.cloneNode(false);
                 cellValue = arr[i][columns[j]];
             td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
             tr.appendChild(td);
         }

         tr = addEdit(tr);
         tr = addDel(tr);

         table.appendChild(tr);
     }
     console.log("table done");



     return table;
 }

 function extractRowData(row){
    var topParent = $(row).parents("tr");
    var children = topParent.children("td");
    var dataInfo = []
    for(var x = 0; x < children.length - 2; x++){
        dataInfo[x] = children[x].textContent
    }
    return dataInfo;
 }

 function deleteData(row){
    var data = extractRowData(row);         //what is inside the Data,  an array [date, time, state, city, address]  format...send this to server saying this was deleted to be deleted from dataframe
    $(row).parents("tr").remove();
 }

 var previousData = []
 var editing = false;
 function editData(row){    //get which row, then after row is changed get what changed and send to server
    var topParent = $(row).parents("tr");
    var children = topParent.children("td");
    if(row.value == "Edit"){
        if(editing == false){
            previousData = [];
            previousData = extractRowData(row);
            row.value  = "Save"
            for(var x = 0; x < children.length - 2; x++){
                children[x].contentEditable = true;
            }
            editing = true;
        }
        else{
            console.log("ALREADY EDITING ANOTHER ONE");
        }
    }
    else if(row.value == "Save"){
        row.value = "Edit";
        for(var x = 0; x < children.length - 2; x++){
            children[x].contentEditable = false;
        }
        var updatedData = extractRowData(row);
                                      
        if(previousData.toString() != updatedData.toString()){
            console.log("it was updated")                       ///JASON HERE the previousData holds the previousData and updatedData holds the updated
            console.log(previousData);
            console.log(updatedData); 
        }
        editing = false;
    }
 }
 

 // NOTE: these functionalities are separated so I can add a popup item to edit. May or may not be the way it will be implemented
 // Add edit buttons to each row of table
 function addEdit(tr) {
     var td = _td_.cloneNode(false);
     var btn = document.createElement('input');
     btn.type = "button";
     btn.className = "editbtn";
     btn.onclick = function() { editData(this);};
     btn.value  = "Edit"
     td.appendChild(btn);
     tr.appendChild(td);

     return tr;
 }

// Add delete buttons to each row of table
function addDel(tr) {
    var td = _td_.cloneNode(false);
    var btn = document.createElement('input');
    btn.type = "button";
    btn.className = "delbtn";
    btn.onclick = function() { deleteData(this);};
    
    td.appendChild(btn);
    tr.appendChild(td);

    return tr;
}

 // Adds a header row to the table and returns the set of columns.
 // Need to do union of keys from all records as some records may not contain
 // all records
 function addAllColumnHeaders(arr, table)
 {
     var columnSet = [],
         tr = _tr_.cloneNode(false);
     for (var i=0, l=arr.length; i < l; i++) {
         for (var key in arr[i]) {
             if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key)===-1) {
                 columnSet.push(key);
                 var th = _th_.cloneNode(false);
                 th.appendChild(document.createTextNode(key));
                 tr.appendChild(th);
             }
         }
     }
     var editth = _th_.cloneNode(false);
     editth.appendChild(document.createTextNode("Edit"));
     tr.appendChild(editth);

     var delth = _th_.cloneNode(false);
     delth.appendChild(document.createTextNode("Delete"));
     tr.appendChild(delth);

     table.appendChild(tr);
     return columnSet;
 }


const x_Axis = [];
const y_Axis = [];

function ProcessData(Text) {
    console.log("passed");
    const size = Text.length;
    console.log("size:", size);
    //console.log(Text);
    //console.log(Text[0].city);
    if (Search(x_Axis, Text) != 1) {
        x_Axis.push(Text[0].city);
        y_Axis.push(size);
    } else {
        console.log("input already in array");
    }
    console.log(x_Axis);
    console.log(y_Axis);
    createChart();
}

function Search(Arr, Text) {
    console.log(Text[0]);
    for (var i = 0; i < Text.length; ++i) {
        for (var j = 0; j < Arr.length; ++j) {
            console.log("Searching for City from Data:", Text[i].city)
            console.log("Searching for city in arr:", Arr[j])
            if (Text[i] == Arr[j].city) {
                return 1;
            } else {
                return 0;
            }
        }

    }
    return 0;
}
//  function Random_Color(value){
//     value = Math.floor(Math.random() * 255) + 1);

//     return value;
//  }

function createChart() {
    console.log("printing");
    //await ProcessData();
    console.log("waited");
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: x_Axis,
            datasets: [{
                label: 'Call of Cities',
                data: y_Axis,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },

    });
    //myChart.render();
}