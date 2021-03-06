function formatRow(count, stop, routes, name) {
    return "<tr id='row_" + count + "'>\n" +
                "<td>" + count + "</td>\n" +
                "<td><div class='form-group has-feedback' id='stop_wrapper_" + count + "'><input type='text' class='form-control no-icon' id='stop_" + count + "' placeholder='Stop' value='" + stop + "'/></div></td>\n" +
                "<td><div class='form-group has-feedback' id='routes_wrapper_" + count + "'><input type='text' class='form-control no-icon' id='routes_" + count + "' placeholder='Routes' value='" + routes + "'/></div></td>\n" +
                "<td><div class='form-group' id='name_wrapper_" + count + "'><input type='text' class='form-control no-icon' id='name_" + count + "' placeholder='Name (optional)' value='" + name + "'/></div></td>\n" +
                "<td><div class='form-group' id='delete_wrapper_" + count + "'><button class='btn btn-default delete-button'  onclick='deleteRow(" + count + ")'><span class='glyphicon glyphicon-remove-sign'/></button></div></td>\n" +
            "</tr>";
}

function deleteRow(rownum) {
    console.log("In deleteRow " + rownum);
    var tr = $("#row_" + rownum);
    console.log(tr);
    tr.remove();
    addEmptyStopIfNecessary();
}

function addEmptyRow() {
    var table = $("#stopstable");
    var count = table.find('tbody').find('tr').length;
    table.append(formatRow(count + 1, "", "", "", false));
}

function addEmptyStopIfNecessary() {
    var table = $("#stopstable");
    var count = table.find('tbody').find('tr').length;
    if (count === 0)
        table.append(formatRow(count + 1, "", "", "", false));
}

function addStop(stop, routes, name) {
    var table = $("#stopstable");
    var count = table.find('tbody').find('tr').length + 1;
    table.append(formatRow(count, stop, routes, name, true));
}

function showSuccess() {
    $("#success_message").show();
}

function hideError() {
    $("#error_message").hide();
}
function showError(message) {
    $("#error_message").html(message).show();
}

// Get query variables
function getQueryParam(variable, defaultValue) {
  // Find all URL parameters
  var query = location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    // If the query variable parameter is found, decode it to use and return it for use
    if (pair[0] === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return defaultValue || false;
}

function saveConfig() {
    var time = $("#24-hour-time").prop('checked');
    var color = $("#color-support").prop('checked');

    var rowElements = $("#stopstable > tbody > tr");

    var stopsList = [];
    for (var i = 0; i < rowElements.length; ++i) {
        var index = i + 1;
        var stop = $('#stop_' + index).prop("value");

        if (stop.match(/^\d+$/)) {
            $('#stop_wrapper_' + index).removeClass("has-error");
            hideError();
        } else {
            $('#stop_wrapper_' + index).addClass("has-error");
            showError('Stop ' + index + " is not a valid stop number");
            return;
        }
        var routes = $('#routes_' + index).prop("value");
        if (routes.match(/^(\d+,)*\d+$/)) {
            $('#routes_wrapper_' + index).removeClass("has-error");
            hideError();
        } else {
            $('#routes_wrapper_' + index).addClass("has-error");
            showError('Routes ' + index + " is not a valid list of routes");
            return;
        }

        var name = $('#name_' + index).prop("value");

        if (stop && routes) {
            stopsList.push({
                "stopNum": stop,
                "routeNums": routes,
                "name" : name
            });
        }
    }

    var config = {
        '24hour': time,
        'color': color,
        'stops': stopsList
    };

    console.log(config);

    var configStr = JSON.stringify(config);
    console.log(configStr);

    showSuccess();

    localStorage.setItem("sbconfig", configStr);

    // Set the return URL depending on the runtime environment
    var return_to = getQueryParam('return_to', 'pebblejs://close#');
    document.location = return_to + encodeURIComponent(configStr);
}

var init = function() {
    var configStr = localStorage.getItem("sbconfig");
    console.log(configStr);
    if (configStr) {
        var config = JSON.parse(configStr);
        $("#24-hour-time").prop('checked', config["24hour"]);
        $("#color-support").prop('checked', config["color"]);
        var stopsList = config.stops;
        for (var i = 0; i < stopsList.length; ++i) {
            addStop(stopsList[i].stopNum, stopsList[i].routeNums, stopsList[i].name);
        }
    }
    addEmptyStopIfNecessary();
};

init();
