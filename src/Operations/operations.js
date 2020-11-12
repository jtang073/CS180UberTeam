const callInfo = require('../dataFrameClass.js')
const keyClass = require('../keyClass.js')

function addData(dataFrame, date, time, state, city, address) {
  var e = new callInfo();
  if (date == "" || time == "" || state == "" || city == "" || address == "") {
    console.log("Error not adding anymore");
    return false;
  }
  date = date.toLowerCase();
  time = time.toLowerCase();
  state = state.toLowerCase();
  city = city.toLowerCase();
  address = address.toLowerCase();

  date = date.split('.');
  date = date[1] + '.' + date[2] + '.' + date[0];

  Object.assign(e.Date = date);
  Object.assign(e.Time = time);
  Object.assign(e.State = state);
  Object.assign(e.City = city);
  Object.assign(e.Address = address);
  var index = address.indexOf(" ");
  Object.assign(e.House = address.substr(0, index));
  Object.assign(e.Street = address.substr(index + 1));
  Object.defineProperty(e, "houseNum", {
    enumerable: false
  });
  Object.defineProperty(e, "street", {
    enumerable: false
  });
  dataFrame.push(e);
  return true;
}

function deleteData(dataFrame, date, time, state, city, address) {
  for (var i = 0; i < dataFrame.length; ++i) {
    if (date == dataFrame[i].Date && time == dataFrame[i].Time && state == dataFrame[i].State && city == dataFrame[i].City && address == dataFrame[i].Address) {
      dataFrame.splice(i, 1); //.splice(index, how many to delete)
      return true;
    }
  }
  return false;
}

function editData(dataFrame, tempOld, tempNew) {
  var editOld = tempOld.split(",");
  var editNew = tempNew.split(",");
  for (var i = 0; i < dataFrame.length; ++i) {
    if (editOld[0] == dataFrame[i].Date && editOld[1] == dataFrame[i].Time && editOld[2] == dataFrame[i].State && editOld[3] == dataFrame[i].City && editOld[4] == dataFrame[i].Address) {
      dataFrame[i].Date = editNew[0].toLowerCase();
      dataFrame[i].Time = editNew[1].toLowerCase();
      dataFrame[i].State = editNew[2].toLowerCase();
      dataFrame[i].City = editNew[3].toLowerCase();
      dataFrame[i].Address = editNew[4].toLowerCase();
      var index = editNew[4].indexOf(" ");
      dataFrame[i].House = editNew[4].substr(0, index).toLowerCase();
      dataFrame[i].Street = editNew[4].substr(index + 1).toLowerCase();
      return true;
    }
  }
  return false;
}

module.exports = { addData, deleteData, editData };
