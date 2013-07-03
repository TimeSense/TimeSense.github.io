
// http://stackoverflow.com/questions/4647817/javascript-object-rename-key

var DataFormat = DataFormat || {};

/*
Assumes that newKey is not taken. Otherwise, overwrites it
*/
DataFormat.renameKey = function (obj, oldKey, newKey){
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

function minutesToHours(m){
  return roundToTwoDecimalPlaces(m/60);
}

function roundToTwoDecimalPlaces(num){
  return Math.round(num * 100) / 100;
}

DataFormat.calendarArrToHighCharts = function (calendarSeriesArr){
  _.each(calendarSeriesArr, function(calendarSeries){
    var calendarData = calendarSeries.data;
    _.each(calendarData, function(dateData){
      DataFormat.renameKey(dateData,'date', 'x');
      dateData.minutes = minutesToHours(dateData.minutes);
      DataFormat.renameKey(dateData, 'minutes', 'y');
    });
  });
  return calendarSeriesArr;
};

DataFormat.calendarToHighCharts = function (objectArray){
  var newObject = [];
  for (var i = 0; i<objectArray.length; i++){
    var obj = objectArray[i];
    if (obj.minutes > 0){
      newObject.push({'name': obj.calendarName, 'y': minutesToHours(obj.minutes), 'color': obj.color});
    }
  }
  return newObject;
}

DataFormat.calendarListToHighCharts = function (dateArray){
  var newObject = [];
  for (var i=0; i<dateArray.length; i++){
    var o = dateArray[i];
    var date = o.date;
    var data = o.data;
    // Add each of the data into their own thing
    // _.defaults(dateArray, );
  }
}