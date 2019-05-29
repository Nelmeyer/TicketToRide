var players = [];
var currentPlayer = 0;
var started = false;
var highScores = [];

function Player() {
    this.id = 0;
    this.name = "";
    this.score = 0;
    this.gameType = "";
    this.stations = 0;
    this.train1 = 0;
    this.train2 = 0;
    this.train3 = 0;
    this.train4 = 0;
    this.train5 = 0;
    this.train6 = 0;
    this.train8 = 0;
    this.missions = 0;
    this.longestTrain = false;
}

function HighScore() {
    this.id = 0;
    this.gameType = "";
    this.scoreDate = "";
    this.score = 0;
    this.player = "";
}

$(function() {
    $("#addPlayer").click(addPlayerEvent);
    $("#saveButton").click(saveClick);
    $("#doneButton").click(doneClick);
    $("#highButton").click(highScoresClick);
    $("button[id*=Minus]").click(buttonPlusMinusClick);
    $("button[id*=Plus]").click(buttonPlusMinusClick);
});

function addPlayerEvent() {
    var newPlayer = new Player();
    newPlayer.id = players.length;
    newPlayer.gameType = $("#gameType").val();
    $("#playerTable").append($("<tr><td><a>Name</a><input type=input id='Player" + players.length + "'></input><a>Score</a><input type=input id='playerScore" + players.length + "'></input><input type='radio' name='longestTrain' id='longTrain" + players.length + "'>Longest Train</input></td></tr>")
        .click(playerSelect));
    players.push(newPlayer);
}

function saveClick() {
    //Save each player to array
    if (players.length > 0) {

        $("input[id*=Player]").each(function (n) {
            players[n].name = this.value;
            players[n].gameType = $("#gameType").val();
            if($("input[id*=longTrain]").get(n).checked) {
                players[n].score = 10;
            }
            else {
                players[n].score = 0;
            }
        });

        showScores();
        currentPlayer = 0;
        getPlayer(0);
        started = true;
    }
}

function playerSelect(e) {
    if (started) {
        //Update array with previous player values
        setPlayer(currentPlayer);

        //Display newly selected player values
        var newPlayer = e.target.id.replace("Player", "").replace("playerScore", "").replace("longTrain", "");
        if (newPlayer) {
            getPlayer(newPlayer);
            currentPlayer = newPlayer;
        }
    }
}

function showScores() {
    var scoreDiv = $("#scores");
    scores.style.visibility = "visible";
}

function buttonPlusMinusClick(e) {
    var targetControl = e.currentTarget;
    var plusMinus = "Plus";
    if (targetControl.id.indexOf("Minus") >= 0) {
        plusMinus = "Minus";
    }
    var targetId = targetControl.id.replace(plusMinus, "");
    var playerScore = document.getElementById("playerScore" + currentPlayer); //$("#playerScore" + currentPlayer);
    if (!playerScore.value) {
        playerScore.value = 0;
    }
    var amount = 1;

    switch (targetId) {
        case "station":
            amount = 4;
            break;
        case "train2":
            amount = 2;
            break;
        case "train3":
            amount = 4;
            break;
        case "train4":
            amount = 7;
            break;
        case "train5":
            amount = 10;
            break;
        case "train6":
            amount = 15;
            break;
        case "train8":
            amount = 21;
            break;
        case "mission":
            amount = $("#missionTotal").val();
            break;
    }
    var targetTotal = document.getElementById(targetId + "Total");
    if (plusMinus == "Minus") {
        if (targetTotal.value > 0) {
            if (targetId != "misison") {
                targetTotal.value = parseInt(targetTotal.value) - 1;
            }
            playerScore.value = parseInt(playerScore.value) - parseInt(amount);
        }
    }
    else {
        if (targetId != "mission") {
            targetTotal.value = parseInt(targetTotal.value) + 1;
        }
        playerScore.value = parseInt(playerScore.value) + parseInt(amount);
    }
}

function setPlayer(id) {
    if (players.length > 0) {
        var player = document.getElementById("Player" + id);
        if (player) {
            players[id].name = player.value;
            players[id].gameType = $("#gameType").val();
            players[id].score = parseInt(document.getElementById("playerScore" + id).value);
            players[id].stations = $("#stationTotal").val();
            players[id].train1 = $("#train1Total").val();
            players[id].train2 = $("#train2Total").val();
            players[id].train3 = $("#train3Total").val();
            players[id].train4 = $("#train4Total").val();
            players[id].train5 = $("#train5Total").val();
            players[id].train6 = $("#train6Total").val();
            players[id].train8 = $("#train8Total").val();
            players[id].missions = $("#missionTotal").val();
        }
    }
}

function getPlayer(id) {
    if (players.length > id) {
        if (players[id]) {
            document.getElementById("playerLabel").innerHTML = "Capture score for " + players[id].name;
            document.getElementById("playerScore" + id).value = players[id].score;
            document.getElementById("Player" + id).value = players[id].name;
            document.getElementById("playerScore" + id).value = players[id].score;
            document.getElementById("stationTotal").value = players[id].stations;
            document.getElementById("train1Total").value = players[id].train1;
            document.getElementById("train2Total").value = players[id].train2;
            document.getElementById("train3Total").value = players[id].train3;
            document.getElementById("train4Total").value = players[id].train4;
            document.getElementById("train5Total").value = players[id].train5;
            document.getElementById("train6Total").value = players[id].train6;
            document.getElementById("train8Total").value = players[id].train8;
            document.getElementById("missionTotal").value = players[id].missions;
        }
    }
}

function doneClick() {
    //Update current player's score to array
    setPlayer(currentPlayer);

    //Get highest Score
    var gameTypeIndex = 0;
    var highIndex = -1;
    var highScore = 0;
    var winPlayer = 0;
    var winScore = 0;
    var saveScore = false;
    var gameType = document.getElementById("gameType").value;

    if (gameType) {
        if (highScores) {
            if (highScores.length > 0) {
                //Get the correct high score
                for (var i = 0; i < highScores.length; i++) {
                    if (highScores[i].gameType == gameType) {
                        gameTypeIndex = i;
                        highScore = highScores[i].score;
                        highIndex = i;
                        break;
                    }
                }
            }
        }

        //Compare
        for (var i = 0; i < players.length; i++) {
            if (players[i].score > winScore) {
                winScore = players[i].score;
                winPlayer = players[i].name;
            }
            else if (players[i].score == winScore) {
                //2 winners
                winPlayer = winPlayer + " & " + players[i].name;
            }
        }

        if (highIndex == -1) {
            var newHighScore = new HighScore();
            highIndex = 0;
            newHighScore.id = highScores.length;
            newHighScore.gameType = gameType;
            newHighScore.player = winPlayer;
            newHighScore.score = winScore;
            highScores.push(newHighScore);
            saveScore = true;
        }

        //Winner
        if (winScore >= highScore) {
            if (winScore == highScore) {
                if (highScores[highIndex].player.indexOf(winPlayer) < 0) {
                    winPlayer = highScores[highIndex].player + " & " + winPlayer;
                    alert("Congratulations " + winPlayer + ", you share the highest score for the " + gameType + " game with " + highScores[highIndex].player + "!");
                }
                else {
                    winPlayer = highScores[highIndex].player;
                    alert("Congratulations " + winPlayer + ", you beat your own highest score for the " + gameType + " game!");
                }
            }
            else {
                alert("Congratulations " + winPlayer + ", you have the highest score for the " + gameType + " game!");
            }
            highScores[highIndex].score = winScore;
            highScores[highIndex].player = winPlayer;
            saveScore = true;
        }
        else {
            alert("Congratulations to our winner " + winPlayer);
        }

        //Save to local storage
        if (saveScore) {
            localStorage.setItem("highScores", JSON.stringify(highScores));
        }
    }
}

function highScoresClick() {
    highScores = JSON.parse(localStorage.getItem("highScores"));

    var strMessage = "High Scores\n";

    if (highScores) {
        for (var i = 0; i < highScores.length; i++) {
            strMessage += "\n" + highScores[i].gameType + "\n";
            strMessage += highScores[i].player + "\n";
            strMessage += highScores[i].score + "\n";
        }
        alert(strMessage);
    }
    else {
        alert("Sorry, there are no High Scores set yet.")
    }
}