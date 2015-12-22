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
                    div.innerHTML = "<table id='coming_races'><tr><th>Dato</th><th>Hvor</th><th>Renn</th></tr></table>";
                    var table = document.getElementById("coming_races");
                    receivedMsg.races.forEach(function (element, index, array) {

                        var row_1 = table.insertRow(-1);
                        var cell_date = row_1.insertCell(0);
                        var cell_1 = row_1.insertCell(1);
                        var cell_2 = row_1.insertCell(2);

                        cell_date.innerHTML = moment(element.racestart_at).format("DD. MMM HH:mm");
                        cell_1.innerHTML = element.location;
                        cell_2.innerHTML = element.racename;
                        cell_2.id = "race_" + element.id;

                        // Add eventlistener() to start a match.
                        document.getElementById("race_" + element.id).addEventListener("click", function () {
                            var d = new Date();
                            var msg = {
                                "type": "start_match",
                                "id": element.id,
                                "league": element.league,
                                "season": element.season,
                                "hometeam": element.hometeam,
                                "awayteam": element.awayteam
                            }
                            msg = JSON.stringify(msg);
                            ws.send(msg);
                        });
                    });
                } else {
                    div.innerHTML = "No races registered."
                    // Add eventlistener() to start a match.
                    document.getElementById("get_coming_matches").addEventListener("click", function () {
                        var d = new Date();
                        var msg = {
                            "type": "get_coming_matches",
                            "league": window.league,
                            "season": window.season,
                        }
                        msg = JSON.stringify(msg);
                        ws.send(msg);
                    });
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

document.getElementById("getComingRacesButton").addEventListener("click", function getComingRaces () {
    var msg = {
        "type": "get races"
    }
    msg = JSON.stringify(msg);
    ws.send(msg);
});

document.getElementById("addRaceButton").addEventListener("click", function addRace () {
    var location = document.getElementById("locationText").value;
    var racename = document.getElementById("racenameText").value;
    var date = document.getElementById("dateText").value;
    if (location.length == 0 || racename.length == 0 || date.length == 0) {
        alert("One or more values are not filled in");
    } else {
        var msg = {
            "type": "add race",
            "location": location,
            "racename": racename,
            "date": date
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
