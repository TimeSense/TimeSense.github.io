// TODO: Update recurrences using this article:
// http://googleappsdeveloper.blogspot.com/2011/12/calendar-v3-best-practices-recurring.html


/*
function drawTable(){
  // print this out
  // console.log(all_data.toJSON());
  // console.log(all_data.toJSON());
  var cfdata = crossfilter(all_data);
  console.log('cfdata is size: ' + cfdata.size());
  var calendar = cfdata.dimension(function (d) {return d.calendar});
  calendar.filterExact("Work");

  console.log(JSON.stringify(calendar.top(10)));
  var dataSTR = JSON.stringify(all_data);
  $("#data_area").val(dataSTR);

}
*/

// var myApp = angular.module('myApp', []);
// http://jsfiddle.net/pjstarifa/FSEVx/16/
function MyCtrl($scope) {

  // This is our list of projects. We don't actually use the description element
  $scope.ViewOptions= [
    {"name": "Today", "description": "Some description", dateRange:[]},
    {"name": "Last Monday", "description": "Some description", dateRange:[]},
    {"name": "Last 4 Mondays", "description": "Some description", dateRange:[]},
    {"name": "Last Week", "description": "Some description", dateRange:[]}
  ];

  $scope.selectedViewOption = $scope.ViewOptions[0];

  // $scope.User={"name": "Peter", "projectId": 30};

  $scope.selectedOption = function(){
    alert("selected new option: " + JSON.stringify($scope.selectedViewOption));
  }

  $scope.drawGraph = function(){
    alert("drawing graph!");
  }

  // Find the projectId in Projects and set the currentProject
  /*
  var len=$scope.Projects.length;
  for(var i = 0; i < len; i++){
    if($scope.Projects[i].id === $scope.User.projectId){
      $scope.selectedProject = $scope.Projects[i];
      break;
    }
  }
  */

}

function calendarsAreLoaded(){
  console.log("calendarsAreLoaded called.");
  var calendarList = Calendar.getCalendarList();
  //('Calendar Data: ' + JSON.stringify(calendarList));
  //console.log('Event Data: ' + JSON.stringify(Calendar.__eventsData));

  // TODO: graph the Today Calendar

  var weekday=new Array(7);
  weekday[0]="Sunday";
  weekday[1]="Monday";
  weekday[2]="Tuesday";
  weekday[3]="Wednesday";
  weekday[4]="Thursday";
  weekday[5]="Friday";
  weekday[6]="Saturday";

  var today = getTodayWithoutTime();
  if (DEBUG_MODE){
    today = new Date(2013,4,2);
  }
  var fiveDaysAgo = getTodayWithoutTime();
  fiveDaysAgo.setDate(today.getDate() - 5);

  var yesterday = getTodayWithoutTime();
  yesterday.setDate(today.getDate() - 1);

  var sevenDaysAgo = getTodayWithoutTime();
  sevenDaysAgo.setDate(today.getDate() - 1);

  // Totals from today by Calendar
  var calendarByTimeDataPre = Calendar.getTotalMinutesByCalendar([today, today]);
  var calendarByTimeDataProcessed = DataFormat.calendarToHighCharts(calendarByTimeDataPre);
  plotPieHighCharts('Today', 'today_pie', calendarByTimeDataProcessed);

  // Totals from today by Event
  var eventByTimeDataPre = Calendar.getMinutesByEventByDate([today,today]);
  var eventByTimeDataProcessed = DataFormat.calendarArrToHighCharts(eventByTimeDataPre);
  plotBarChart2('Events from Today', 'today_events_bar', eventByTimeDataProcessed);

  /*
  var calendarByTimeDataPre2 = Calendar.getTotalMinutesByCalendar([sevenDaysAgo, sevenDaysAgo]);
  console.log('pre:' + JSON.stringify(calendarByTimeDataPre2));
  var calendarByTimeDataProcessed2 = DataFormat.calendarToHighCharts(calendarByTimeDataPre2);
  console.log('post:' + JSON.stringify(calendarByTimeDataProcessed2));
  // console.log(JSON.stringify(calendarByTimeDataProcessed));
  plotPieHighCharts('Last ' + weekday[sevenDaysAgo.getDay()], 'yesterday_pie', calendarByTimeDataProcessed2);
  */

  var calendarsByDateRangePre = Calendar.getMinutesByDateByCalendar([fiveDaysAgo, today]);
  var calendarsByDateRangeProcessed = DataFormat.calendarArrToHighCharts(calendarsByDateRangePre);
  // var calendarColors = _.pluck(calendarsByDateRangeProcessed, 'color');
  // console.log(JSON.stringify(calendarsByDateRangeProcessed));
  plotColumnHighCharts('Column', 'week_column', calendarsByDateRangeProcessed);

  var dateRange = [fiveDaysAgo, today];
  // var result = JSON.stringify(Calendar.getMinutesByEventByDate(dateRange));
  var eventsByDateRangePre = Calendar.getMinutesByEventByDate(dateRange);
  var eventsByDateRangeProcessed = DataFormat.calendarArrToHighCharts(eventsByDateRangePre);
  plotColumnHighCharts('Column2', 'week_events_column', eventsByDateRangeProcessed);

  // return result;





  // Get the data for the last couple days



  /*
  for (var i=0; i<calendarList.length; i++){

    var calendar = calendarList[i];
    // populate the __calendarsData

    var calendarPrefix = "calendar_choice_";
    // var name = graphScopes[selectedScope]['slices'][selectedSlice]['views'][view].name;
    var radio = $('<input/>').attr({
      type: 'radio',
      name: 'calendar_choice',
      value: calendar.summary,
      id: calendarPrefix + i
    });
    checked = false; // check only the first radio button

    $('#calendar_list').append(radio);

    // TODO: labels
    var radioLabel = $('<label>', {
      text : calendar.summary,
      "class" : 'radioLabel',
      "for": calendarPrefix + i
    });
    // alert(name);

    $('#calendar_list').append(radioLabel);
  }
  */

  // drawTable();

  /*
  // Make this look like a button set
  $('#calendar_list').buttonset('destroy');
  // $("#calendar_list").buttonset('refresh');
  $('#calendar_list').buttonset();
  */
}

function progressCallback(progressInfo){
  console.log("progressInfo:" + JSON.stringify(progressInfo));
}

// This function is called after a successful authorization
// Anything related to graphs should occur here and after
function userWasAuthorized(){
  var authorizeButton = document.getElementById('authorize-button');
  authorizeButton.style.visibility = 'hidden';
  $("#analysis").show();
  $("#auth_stuff").hide();
  Calendar.loadCalendars(calendarsAreLoaded, progressCallback);


}

$(document).ready(function() {

  $("#analysis").hide();
  if (DEBUG_MODE) {
    // So it's not annoying each time
    handleAuthClick();
  }

  // Handler for .ready() called.

  // Load __calendarsData



});