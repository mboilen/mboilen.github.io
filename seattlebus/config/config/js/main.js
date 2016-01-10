function formatRow(count, stop, routes) {
    return "<tr id='row_" + count + "'>\n" +
                "<td>" + count + "</td>\n" +
                "<td><div class='form-group has-feedback' id='stop_wrapper_" + count + "'><input type='text' class='form-control' id='stop_" + count + "' placeholder='Stop' value='" + stop + "'/></div></td>\n" +
                "<td><div class='form-group has-feedback' id='routes_wrapper_" + count + "'><input type='text' class=form-control id='routes_" + count + "' placeholder='Routes' value='" + routes + "'/></div></td>\n" +
                "<td><button class='btn btn-default' onclick='deleteRow(" + count + ")'><span class='glyphicon glyphicon-remove-sign'/></button></td>\n" +
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
    table.append(formatRow(count + 1, "", "", false));
}

function addEmptyStopIfNecessary() {
    var table = $("#stopstable");
    var count = table.find('tbody').find('tr').length;
    if (count === 0)
        table.append(formatRow(count + 1, "", "", false));
}

function addStop(stop, routes) {
    var table = $("#stopstable");
    var count = table.find('tbody').find('tr').length + 1;
    table.append(formatRow(count, stop, routes, true));
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

        if (stop && routes) {
            stopsList.push({
                "stopNum": stop,
                "routeNums": routes
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

    location.href = 'pebblejs://close#' + encodeURIComponent(configStr);
    
}

var init = function() {
    var configStr = localStorage.getItem("sbconfig");
    console.log(configStr);
    if (!configStr)
        return;
    var config = JSON.parse(configStr);
    $("#24-hour-time").prop('checked', config["24hour"]);
    $("#color-support").prop('checked', config["color"]);
    var stopsList = config.stops;
    for (var i = 0; i < stopsList.length; ++i) {
        addStop(stopsList[i].stopNum, stopsList[i].routeNums);
    }
    addEmptyStopIfNecessary();
};

init();
