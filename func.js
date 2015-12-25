// http://www.tutorialspoint.com/html5/html5_websocket.htm

var ws = "";

// Add eventlistener when the page loads.
document.addEventListener("DOMContentLoaded", function () {
    if (window.WebSocket) {
        // Let us open a web socket.
        var hname = window.location.hostname;
        ws = new WebSocket("ws://" + hname + ":9003");
        ws.onopen = function () {
            var msg = {
                "type": "get races"
            }
            msg = JSON.stringify(msg);
            ws.send(msg);
        }

        // Add Pikaday datepicker to input type text.
        var picker = new Pikaday({
            field: document.getElementById("dateText"),
            position: "bottom right",
            reposition: false,
            use24hour: true
        });

        ws.onmessage = function (e) {
            var receivedMsg = JSON.parse(e.data);


            if (receivedMsg.type == "races") {
                var div = document.getElementById("comingRaces");

                // If it's an array, ie. has data.
                if (Array.isArray(receivedMsg.races)) {
                    var tbl = "<table id='coming_races'><tr><th>Dato</th><th>Hvor</th>";
                    tbl = tbl + "<th>Renn</th><th>Interval</th><th>Vælg</th></tr></table>";
                    div.innerHTML = tbl;
                    var table = document.getElementById("coming_races");
                    receivedMsg.races.forEach(function (element, index, array) {

                        var row_1 = table.insertRow(-1);
                        var cell_date = row_1.insertCell(0);
                        var cell_location = row_1.insertCell(1);
                        var cell_racename = row_1.insertCell(2);
                        var cell_interval = row_1.insertCell(3);
                        var cell_select = row_1.insertCell(4);

                        cell_date.innerHTML = moment(element.racestart_at).format("DD. MMM HH:mm");
                        cell_location.innerHTML = element.location;
                        cell_racename.innerHTML = element.racename;
                        cell_interval.innerHTML = element.interval + " sek.";
                        cell_interval.className = "right_align_text";
                        cell_select.innerHTML = "<input type='radio' name='race'>";
                        cell_select.className = "center_align_text";
                        cell_select.id = "race_" + element.id;

                        // Add eventlistener() to select a race.
                        document.getElementById("race_" + element.id).addEventListener("click", function () {
                            // Set race related values when adding a participant
                            document.getElementById("locationHidden").value = element.location;
                            document.getElementById("racenameHidden").value = element.racename;
                            document.getElementById("dateHidden").value = element.racestart_at;
                            document.getElementById("intervalHidden").value = element.interval;
                            // Erase any values that may have been assigned to a participant
                            document.getElementById("nameText").value = "";
                            document.getElementById("genderText").value = "";
                            document.getElementById("bornText").value = "";
                            document.getElementById("clubText").value = "";
                            var msg = {
                                "type": "get participants",
                                "id": element.id,
                                "location": element.location,
                                "racename": element.racename,
                                "racestart_at": element.racestart_at
                            }
                            msg = JSON.stringify(msg);
                            ws.send(msg);
                        });
                    });
                } else {
                    div.innerHTML = "No races registered, please add race."
                }
            }

            if (receivedMsg.type == "participants") {
                var div = document.getElementById("participants");

                // If it's an array, ie. has data.
                if (Array.isArray(receivedMsg.participants)) {
                    var tbl = "<table id='participantsTable'><tr><th>Startnr</th><th>Navn</th><th>Årstal</th>";
                    tbl = tbl + "<th>Klub</th><th>Start</th></tr></table>";
                    div.innerHTML = tbl;
                    var table = document.getElementById("participantsTable");
                    var interval_var = document.getElementById("intervalHidden").value;
                    receivedMsg.participants.forEach(function (element, index, array) {

                        var row_1 = table.insertRow(-1);
                        var cell_startnr = row_1.insertCell(0);
                        var cell_name = row_1.insertCell(1);
                        var cell_born = row_1.insertCell(2);
                        var cell_club = row_1.insertCell(3);
                        var cell_start_at = row_1.insertCell(4);

                        cell_startnr.innerHTML = element.raceid || index + 1;
                        cell_startnr.className = "right_align_text";
                        cell_name.innerHTML = element.name;
                        cell_born.innerHTML = element.born;
                        cell_club.innerHTML = element.club;
                        cell_start_at.innerHTML = moment(element.start_at || element.racestart_at).add(interval_var * index, 'seconds').format("HH:mm:ss");

                        // Add eventlistener() to select a race.
                        /*document.getElementById("rparticipant_" + element.id).addEventListener("click", function () {
                            var msg = {
                                "type": "select participant",
                                "id": element.id,
                                "location": element.location,
                                "racename": element.racename
                            }
                            msg = JSON.stringify(msg);
                            ws.send(msg);
                        });*/
                    });
                } else {
                    div.innerHTML = "No participants registered, select a race on the left or add one to the current."
                }
            }

            if (receivedMsg.type == "msg") {
                alert("Message received: " + receivedMsg.data);
                document.getElementById("view1").innerHTML = "Data: " + receivedMsg.data + ", length: " + receivedMsg.cnt;
            }
        }

        ws.onerror = function (e) {
            alert("Unable to connect");
        }

        ws.onclose = function (e) {
            // For safari
            if (e.code == 1006) {
                alert("Unable to connect");
            } else {
                alert("Connection closed");
            }
        }
    } else {
        alert("Websocket unsupported");
    }
});

document.getElementById("addRaceButton").addEventListener("click", function addRace () {
    var location = document.getElementById("locationText").value;
    var racename = document.getElementById("racenameText").value;
    var racestart_at = document.getElementById("dateText").value;
    var interval = document.getElementById("intervalText").value;
    if (location.length == 0 || racename.length == 0 || racestart_at.length == 0 || interval.length == 0) {
        alert("One or more values are not filled in");
    } else {
        var msg = {
            "type": "add race",
            "location": location,
            "racename": racename,
            "racestart_at": racestart_at,
            "interval": interval
        }
        msg = JSON.stringify(msg);
        ws.send(msg);
    }
});

document.getElementById("addParticipantButton").addEventListener("click", function addParticipant () {
    var location = document.getElementById("locationHidden").value;
    var racename = document.getElementById("racenameHidden").value;
    var racestart_at = document.getElementById("dateHidden").value;
    var name = document.getElementById("nameText").value;
    var gender = document.getElementById("genderText").value;
    var born = document.getElementById("bornText").value;
    var club = document.getElementById("clubText").value;
    if (name.length == 0 || gender.length == 0 || born.length == 0 || club.length == 0) {
        alert("One or more values are not filled in");
    } else {
        var msg = {
            "type": "add participant",
            "location": location,
            "racename": racename,
            "racestart_at": racestart_at,
            "name": name,
            "gender": gender,
            "born": born,
            "club": club
        }
        msg = JSON.stringify(msg);
        ws.send(msg);
    }
});

function testWebsocket () {
    if (window.WebSocket) {
        alert("Websocket supported");
    } else {
        alert("Websocket unsupported");
    }
}
