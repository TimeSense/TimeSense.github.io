/*

 API:

 - getEventsFromTimeRange(inclusive_start, inclusive_end)

 getEventsWithOptions(options)
 // if options == null, returns all options
 options = {startInclusive: startDate,
 endInclusive: endDate,
 calendars: [],

 }

 */

/*
Since this class only makes sense with one calendar,
this will use a Singleton object design approach detailed in the

 http://robdodson.me/blog/2012/08/08/javascript-design-patterns-singleton/

 like Three.js

Using this approach because callbacks from calls
to request need to store data in the right location

 */

/*
 NOTE: two undescores implies private function
 */

// TODO: should handle calendar colors differently
var calendarColors = {};
// var all_data = [];

// Debug mode loads pre-loaded data

/*
 Calls the __calendarsLoadedCallback after all of the __calendarsData
 and events have been loaded.
 */

// Prevent duplicate declaration. See here:
// https://code.google.com/p/closure-library/source/browse/closure/goog/base.js
var Calendar = Calendar || {};


// TODO: prevent __downloadCalendarList from calling this twice
Calendar.__calendarsData = {};
Calendar.__eventsData = [];

Calendar.__calendarsLoadedCallback = null;
Calendar.__progressCallback = null;


// Used to indicated progress
Calendar.__totalCalendarsToDownload = 0;
Calendar.__calendarsDownloaded = 0;

Calendar.getEventsWithOptions = function(){
  // do something
}

Calendar.getCalendarList = function(){
  // returns list of __calendarsData
  // NOTE: this does not return a copy
  return Calendar.__calendarsData;
}

Calendar.__downloadEvents = function(){
  return null;
}

// Using a modification of
// http://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates
// for the dates between two dates
function getNextDate(d) {
  var newD = new Date(d.valueOf());
  newD.setDate(newD.getDate() + 1);
  return newD;
}

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date (currentDate));
    currentDate = getNextDate(currentDate);
  }
  return dateArray;
}

function getTodayWithoutTime(){
  return getDateWithoutTime(new Date());
}

function getDateWithoutTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

Calendar.getMinutesByEventByDate = function (dateRange, selectedCalendarIds) {

  // TODO: also allow filtering by Event Name

  // TODO: allow way to stop query if the # of unique events > some value

  // Get a list of all calendarIDs
  if (selectedCalendarIds == null) {
    selectedCalendarIds = _.pluck(Calendar.__calendarsData, 'id');
  }

  // The second element in a range is exclusive for crossfilter, so increment
  // dateRange is inclusive on both sides
  dateRange[1] = getNextDate(dateRange[1]);

  var result = [];

  var cf = crossfilter(Calendar.__eventsData);
  var eventsByDate = cf.dimension(function(e){return e.date});
  eventsByDate.filterRange(dateRange);

  // Filter by specified calendars
  var eventsByCalendar = cf.dimension(function(e){return e.calendarId});
  eventsByCalendar.filterFunction(function(calendarId){return _.indexOf(selectedCalendarIds, calendarId) >= 0;});

  //console.log(JSON.stringify(eventsByCalendar.top(Infinity)));
  //console.log(_.indexOf(selectedCalendarIds, selectedCalendarIds[0]));


  // Start analysis over, now with only the data in the correct time range
  cf = crossfilter(eventsByDate.top(Infinity));


  // Filter by event names
  var eventsByName = cf.dimension(function(e){return e.name});
  // Get a list of unique event names



  var uniqueEventNames = _.map(eventsByName.group().all(), function(o){return o.key});
  // return uniqueEventNames;


  for (var i=0; i<uniqueEventNames.length; i++){
    var uniqueEventName = uniqueEventNames[i];
    eventsByName.filterAll();

    eventsByName.filterExact(uniqueEventName);

    // calendarNameDimension is needed because of this statement in the API Documentation:
    // Note: a grouping intersects the crossfilter's current filters, except for the
    // associated dimension's filter. Thus, group methods consider only records that
    // satisfy every filter except this dimension's filter. So, if the crossfilter of
    // payments is filtered by type and total, then group by total only observes the filter by type.

    var cf2 = crossfilter(eventsByName.top(Infinity));

    var eventsByDate2 = cf2.dimension(function(e){return e.date;});
    var minutesByDate = eventsByDate2.group().reduceSum(function(e) { return e.minutes; });

    var eventData = {};
    eventData.name = uniqueEventName;
    //calendarData.name = Calendar.__calendarsData[uniqueEventName].summary;
    //calendarData.color = Calendar.__calendarsData[uniqueEventName].backgroundColor;

    eventData.data = minutesByDate.top(Infinity);

    if (_.isEmpty(eventData.data)){
      continue;
    }

    // TODO: need to make the bottom "each"
    _.each(eventData.data, function (o){
      DataFormat.renameKey(o, 'key', 'date');
      DataFormat.renameKey(o, 'value', 'minutes');
    });

    result.push(eventData);
  }

  return result;
}

/*
Null if no calendar
 */
Calendar.getMinutesByDateByCalendar = function (dateRange, selectedCalendarIds) {
  // Get a list of all calendarIDs
  if (selectedCalendarIds == null) {
    selectedCalendarIds = _.pluck(Calendar.__calendarsData, 'id');
  }

  // The second element in a range is exclusive for crossfilter, so increment
  // dateRange is inclusive on both sides
  dateRange[1] = getNextDate(dateRange[1]);

  var result = [];

  var cf = crossfilter(Calendar.__eventsData);
  var eventsByDate = cf.dimension(function(e){return e.date});
  eventsByDate.filterRange(dateRange);

  var eventsByCalendar = cf.dimension(function(e){return e.calendarId});

  for (var i=0; i<selectedCalendarIds.length; i++){
    var calendarID = selectedCalendarIds[i];
    eventsByCalendar.filterAll();

    eventsByCalendar.filterExact(calendarID);

    // calendarNameDimension is needed because of this statement in the API Documentation:
    // Note: a grouping intersects the crossfilter's current filters, except for the
    // associated dimension's filter. Thus, group methods consider only records that
    // satisfy every filter except this dimension's filter. So, if the crossfilter of
    // payments is filtered by type and total, then group by total only observes the filter by type.

    var cf2 = crossfilter(eventsByCalendar.top(Infinity));

    var eventsByDate2 = cf2.dimension(function(e){return e.date;});
    var minutesByDate = eventsByDate2.group().reduceSum(function(e) { return e.minutes; });

    var calendarData = {};
    calendarData.name = Calendar.__calendarsData[calendarID].summary;
    calendarData.color = Calendar.__calendarsData[calendarID].backgroundColor;

    calendarData.data = minutesByDate.top(Infinity);

    if (_.isEmpty(calendarData.data)){
      continue;
    }

    // TODO: need to make the bottom "each"
    _.each(calendarData.data, function (o){
      DataFormat.renameKey(o, 'key', 'date');
      DataFormat.renameKey(o, 'value', 'minutes');
    });

    result.push(calendarData);
  }

  return result;
}

/*
Calendar.getMinutesByDateAndCalendar = function(start, end){
  var dates = getDates(start, end);
  var output = [];
  for (var i=0; i<dates.length; i++){
    var date = dates[i];
    var newObj = {};
    newObj.date = date;
    newObj.data = Calendar.getTotalMinutesByCalendar(date);
    output.push(newObj);
  }
  return output;
}
*/

Calendar.getTotalMinutesByCalendar = function(dateRange){
  dateRange[0] = getDateWithoutTime(dateRange[0]);
  dateRange[1] = getDateWithoutTime(dateRange[1]);
  var cf = crossfilter(Calendar.__eventsData);
  var eventsByDate = cf.dimension(function(e){return e.date});
  // eventsByDate.filterExact(date);
  eventsByDate.filterRange([dateRange[0], getNextDate(dateRange[1])]);

  var eventsByCalendar = cf.dimension(function(e){return e.calendarId});
  var minutesByCalendar = eventsByCalendar.group().reduceSum(function(e) { return e.minutes; })

  //return eventsByDate.top(10);
  var calendarsWithTime = minutesByCalendar.top(Infinity);
  // var output = [];
  for (var i=0; i<calendarsWithTime.length; i++){
    var calendar = calendarsWithTime[i];
    calendar.color = Calendar.__calendarsData[calendar.key].backgroundColor;
    calendar.calendarName = Calendar.__calendarsData[calendar.key].summary;
    DataFormat.renameKey(calendar, 'key', 'calendarID');
    DataFormat.renameKey(calendar, 'value', 'minutes');

    // console.log('color: ' + Calendar.__calendarsData['backgroundColor']);
    // console.log(JSON.stringify(calendar));
    // output.push(calendar);
  }
  // console.log(JSON.stringify(output));
  return calendarsWithTime;
}


Calendar.__calendarListDownloadedCallback = function(){
  // for each of these __calendarsData, call the download calendar function


  // TODO: the function below should NOT be called here
  // It should be completed only when all of the events rae downloaded
  console.log("called __calendarListDownloadedCallback");
  Calendar.__totalCalendarsToDownload = _.size(Calendar.__calendarsData);

  for (var calendarId in Calendar.__calendarsData){
    Calendar.__downloadCalendarEventsApiCall(calendarId);
  }


}

Calendar.loadCalendars = function(calendarsLoadedCallback, progressCallback){
  // Todo: call this for every calendar
  // downloadCalendarEventsApiCall(calendar.id, null);

  if (DEBUG_MODE){
    Calendar.__calendarsData = calendarsData_DEBUG;
    Calendar.__eventsData = eventsData_DEBUG;
    // TODO: add progressCallback to DEBUG_MODE so that can be tested as well
    calendarsLoadedCallback();
    return;
  }
  Calendar.__calendarsLoadedCallback = calendarsLoadedCallback;
  Calendar.__progressCallback = progressCallback;

  Calendar.__downloadCalendarList();

  // Calendar.__downloadEvents();

  // __calendarsLoadedCallback();
}


Calendar.__downloadCalendarList = function(){

  // TODO check if the list is empty or not (don't want to call twice)

  gapi.client.load('calendar', 'v3', function(){
    var request = gapi.client.calendar.calendarList.list();
    request.execute(function(resp) {
      for (var i = 0; i < resp.items.length; i++) {
        var calendar = resp.items[i];
        if (calendar.accessRole == "owner") {
          Calendar.__calendarsData[calendar.id] = calendar;
          calendarColors[calendar.summary] = calendar.backgroundColor;
        }
      }
      // TODO: call callback sayng that the stuff is loadedr
      // console.log(JSON.stringify(Calendar.__calendarsData));
      // console.log("__downloadCalendarList request callback done.");
      Calendar.__calendarListDownloadedCallback();
      Calendar.__progressCallback({completed: false, status:"Finished downloading calendar list."});

    });
  });
}


function is_valid_date(d) {
  // cite: http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
  return d instanceof Date && isFinite(d);
}



Calendar.__downloadCalendarEventsApiCall = function(calendarID, pageToken) {
  gapi.client.load('calendar', 'v3', function() {
    // TODO: Increment maxResults to something like ~10,000?
    // Need to balance memory usage with making fewer API calls
    request_properties = {
      'calendarId': calendarID,
      'singleEvents': true,
      'timeMax': new Date(),
      'maxResults': 500,
      'pageToken': pageToken
    };
    if (pageToken) {
      request_properties.pageToken = pageToken;
    }
    var request = gapi.client.calendar.events.list(request_properties);
    request.execute(function (resp) {

      if (!resp.items) {
        console.log("No events found for the calendar: " + resp.summary);
        Calendar.__calendarsDownloaded++;
        return;
      }

      for (var i = 0; i < resp.items.length; i++) {
        var event = resp.items[i];
        var startDT = new Date(event.start.dateTime);
        if (!is_valid_date(startDT)){
          // it's an all-day event
          // TODO: in future, use the value of the all-day calendar if it's "TRACK-" for a calendar
          continue;
        }
        var endDT = new Date(event.end.dateTime);

        // subtracting two date times gives the difference in milliseconds
        // milliseconds in one minute: 60 * 1000 = 60,000
        var minutes = Math.round((endDT - startDT) / 60000);
        // calculate duration between endDT and startDT
        // console.log("duration was: " + minutes);

        var date = new Date(startDT.getFullYear(), startDT.getMonth(), startDT.getDate());
        var time = [startDT.getHours(), startDT.getMinutes(), 0, 0];
        Calendar.__eventsData.push({name: event.summary, calendarId: calendarID, date: date, time: time, minutes: minutes, location: event.location, description: event.description});
      }
      // redraw with new table
      // drawTable();

      // If more results exist, fetch them
      var pageToken = resp.nextPageToken;
      if (pageToken) {
        console.log("Next token: " + pageToken);
        Calendar.__downloadCalendarEventsApiCall(calendarID, pageToken);
      } else{
        // TODO: set complete:true if everything is done

        Calendar.__calendarsDownloaded++;


        if (Calendar.__calendarsDownloaded == Calendar.__totalCalendarsToDownload){
          Calendar.__progressCallback({completed: true, status:"Finished downloading calendar: " + calendarID});
          // Call completed callback
          // console.log("Calling original __calendarsLoadedCallback callback");
          Calendar.__calendarsLoadedCallback();
        }else{
          Calendar.__progressCallback({completed: false, status:"Finished downloading calendar: " + calendarID});
        }

      }
    });
  });
}
