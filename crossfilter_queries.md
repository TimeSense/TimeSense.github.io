# CrossFilter Code

## API

The API will return crossfilter data output. This output will then need to be parsed before it can be used by a graphing library.

* Time series
	* **getMinutesByDateAndCalendar(start, end)**
		* Calls getMinutesByCalendarAggregate(…,aggregateType=Sum) for each date in the time range
	* **getMinutesByDateAndEvent()**
		* Calls getMinutesByEventAggregate(…,aggregateType=Sum) for each date in the time range
* Aggregate over time range methods:
	* Day of the week:
		* **getMinutesByDayAndCalendar()**
		* **getMinutesByDayAndEvent()**	
	* Individual
	    * **getMinutesByCalendar(date)**
	    * **getMinutesByEvent(date)**
	* Total / Average Aggregate:
		* **getMinutesByEventAggregate(start, end, calendars, aggregateType)**
		* **getMinutesByCalendarAggregate(start, end, calendars, aggregateType)**
		* **getEventCountsByCalendar(start, end, calendars)**

__Notes:__

- null values for start and end time indicate epoch and today, respectively.
- start and end times are inclusive
- null value for calendar indicates all calendars
- aggregateType = sum or average


## Code

### Setup

    var cf = crossfilter(eventsData_DEBUG);
    <insert more code here>
    var result = JSON.stringify(<final object>);
    return result;
    


### Get number of events in each calendar

	var cf = crossfilter(eventsData_DEBUG);
	
	var eventsByCalendar = cf.dimension(function(d){return d.calendar});
	var eventsCountByCalendar = eventsByCalendar.group().all();
	
	var result = JSON.stringify(eventsCountByCalendar);
	return result;

### Get 10 most recent events


    var cf = crossfilter(eventsData_DEBUG);
    
    var eventsByDate = cf.dimension(function(d){return d.date});
    
    var result = JSON.stringify(eventsByDate.top(10));
	return result;
	
### Group calendars by date


	var cf = crossfilter(eventsData_DEBUG);
    var eventsByDate = cf.dimension(function(d){return d.date});
    var eventsGroupByDate = eventsByDate.group(function(date) {return date});
    var result = JSON.stringify(eventsByDate.top(10));
	return result;
	
### Events on a given day, in order of occurence
	var cf = crossfilter(eventsData_DEBUG);
	var filterDate = new Date(2013, 3, 30);
	var eventsByDate = cf.dimension(function(d){return d.date});
	eventsByDate.filterExact(d);
	var result = JSON.stringify(eventsByDate.top(Infinity));
	return result;

### Time spent on calendars in a given day



	var cf = crossfilter(eventsData_DEBUG);
	var filterDate = new Date(2013, 3, 30);
	var eventsByDate = cf.dimension(function(d){return d.date});
	eventsByDate.filterExact(filterDate);
	
	var eventsByCalendar = cf.dimension(function(d){return d.calendar});
	var minutesByCalendar  = eventsByCalendar.group().reduceSum(function(e) { return e.minutes; })
	
	
	var result = JSON.stringify(minutesByCalendar.top(Infinity));
	return result;
	
>[{"key":"Main","value":240},{"key":"Work","value":165},{"key":"Learning","value":0},{"key":"Mindfulness","value":0},{"key":"Office Hours","value":0},{"key":"Social","value":0},{"key":"Fitness","value":0},{"key":"Conscious Timewasting","value":0}]

The nice thing about this function is that even if no time was spent on calendars for this day (ie. 0 hours on everything), this would return 0 for each calendar everything.

> [{"key":"Fitness","value":0},{"key":"Learning","value":0},{"key":"Main","value":0},{"key":"Mindfulness","value":0},{"key":"Office Hours","value":0},{"key":"Social","value":0},{"key":"Work","value":0},{"key":"Conscious Timewasting","value":0}]


### Time spent on all events in a given day

Note: basically all the event names ever created will show up. This is quite unmanagable, and requries some filtering on event names (or atleast by calendar) to make it practical

	var cf = crossfilter(eventsData_DEBUG);
	var filterDate = new Date(2013, 3, 30);
	var eventsByDate = cf.dimension(function(d){return d.date});
	eventsByDate.filterExact(filterDate);

	var eventsOnSelectedDate = eventsByDate.top(Infinity);
	var eventsByName = cf.dimension(function(e){return e.summary});
	var minutesForEvent  = eventsByName.group().reduceSum(function(e) { return e.minutes; })
	
	var result = JSON.stringify(minutesForEvent.top(Infinity));
	return result;

### Time spent on events in a given day

	var cf = crossfilter(eventsData_DEBUG);
	var filterDate = new Date(2013, 3, 30);
	var eventsByDate = cf.dimension(function(d){return d.date});
	eventsByDate.filterExact(filterDate);

    // Restart analysis with that output

    var eventsOnSelectedDate = eventsByDate.top(Infinity);

    var newCf = crossfilter(eventsOnSelectedDate);
	
	var eventsByName = newCf.dimension(function(e){return e.summary});
	var minutesForEvent  = eventsByName.group().reduceSum(function(e) { return e.minutes; })
	
	
	var result = JSON.stringify(minutesForEvent.top(Infinity));
	return result;


### Sum of time spent on each calendar in a time range (TODO)

	var cf = crossfilter(eventsData_DEBUG);
	
	var d = new Date(2013, 4, 30);
	var eventsByDate = cf.dimension(function(d){return d.date});
	// TODO: filter by this date
	eventsByDate.filterExact(d);
	var result = JSON.stringify(eventsByDate.top(10));
	return result;
	
	

	