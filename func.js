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

            if (receivedMsg.type == "table") {
                var div = document.getElementById("view1");
                div.innerHTML = "<table id='standings' class='center'><tr><th class='right_align'>#</th><th>Team</th><th class='right_align'>M</th><th class='right_align'>W</th><th class='right_align'>D</th><th class='right_align'>L</th><th class='right_align'>Goal</th><th class='right_align'>P</th></tr></table>";
                var table = document.getElementById("standings");
                receivedMsg.teams.sort(function (a, b) {
                    return b.points - a.points;
                });

                if (Array.isArray(receivedMsg.teams)) {
                    receivedMsg.teams.forEach(function (element, index, array) {
                        window.league = element.league;
                        window.season = element.season;

                        var row = table.insertRow(-1); // Last row.
                        var cell_standing = row.insertCell(0);
                        var cell_team = row.insertCell(1);
                        var cell_matches = row.insertCell(2);
                        var cell_won = row.insertCell(3);
                        var cell_draw = row.insertCell(4);
                        var cell_lost = row.insertCell(5);
                        var cell_goals = row.insertCell(6);
                        var cell_points = row.insertCell(7);

                        row.className = "shift_color";

                        cell_standing.className = "right_align";
                        cell_standing.innerHTML = index + 1;
                        cell_team.innerHTML = element.team;
                        cell_matches.innerHTML = element.won + element.draw + element.lost;
                        cell_matches.className = "right_align";
                        cell_won.innerHTML = element.won;
                        cell_won.className = "right_align left_pad";
                        cell_draw.innerHTML = element.draw;
                        cell_draw.className = "right_align left_pad";
                        cell_lost.innerHTML = element.lost;
                        cell_lost.className = "right_align left_pad";
                        cell_goals.innerHTML = element.goals_for.toString() + "-" + element.goals_against.toString();
                        cell_goals.className = "right_align left_pad";
                        cell_points.className = "right_align left_pad";
                        cell_points.innerHTML = element.points;
                    });
                }

            }

            if (receivedMsg.type == "races") {
                var div = document.getElementById("comingRaces");

                // If it's an array, ie. has data.
                if (Array.isArray(receivedMsg.races)) {
                    div.innerHTML = "<table id='coming_matches'></table>";
                    var table = document.getElementById("coming_matches");
                    receivedMsg.teams.forEach(function (element, index, array) {

                        var row_1 = table.insertRow(-1);
                        var cell_date = row_1.insertCell(0);
                        var cell_1 = row_1.insertCell(1);
                        var cell_2 = row_1.insertCell(2);

                        cell_date.innerHTML = moment(element.match_start_at).format("DD. MMM HH:mm");
                        cell_1.innerHTML = "";
                        cell_2.innerHTML = "<button class='btn'>Start</button>";
                        cell_2.id = "start_match_" + element.id;

                        var row_2 = table.insertRow(-1);
                        var cell_hometeam = row_2.insertCell(0);
                        var cell_awayteam = row_2.insertCell(1);
                        var cell_empty = row_2.insertCell(2);

                        row_1.className = "first_second_four";
                        row_2.className = "first_second_four";

                        cell_hometeam.innerHTML = element.hometeam;
                        cell_awayteam.innerHTML = element.awayteam;

                        // Add eventlistener() to start a match.
                        document.getElementById("start_match_" + element.id).addEventListener("click", function () {
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
    alert("Race location: " + location + ", name: " + racename + ", date: " + date);
});

function testWebsocket () {
    if (window.WebSocket) {
        alert("Websocket supported");
    } else {
        alert("Websocket unsupported");
    }
}
