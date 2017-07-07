var gameOn = false;
var setOrTest = "set";
var strict = false;
var currentPattern = [];
var playerPattern = [];
var clickDelay = 800;
var currentCount = 0;
var interval;
var i = 0;
var audio1 = $("#audio1")[0];
var audio2 = $("#audio2")[0];
var audio3 = $("#audio3")[0];
var audio4 = $("#audio4")[0];

$(".onOffToggle").click(function() {
  if (gameOn == false) {
    turnGameOn();
  } else {
    turnGameOff();
  }
});

function turnGameOn() {
  $(".activeToggle").animate({marginLeft: "25px"}, 300);
  gameOn = true;
  $(".countDisplay").html(currentCount);
}

function turnGameOff() {
  $(".activeToggle").animate({marginLeft: "0"}, 300);
  gameOn = false;
  $(".countDisplay").html('');
  currentPattern = [];
  playerPattern = [];
  clickDelay = 800;
  currentCount = 0;
  i = 0;
  setOrTest = "set";
}

function randomButton() {
  return Math.ceil(Math.random() * 4);  
}

function addToPattern() {
  currentPattern.push(randomButton());
  $(".countDisplay").html(currentPattern.length);
}

function displayPattern() {
    if (currentPattern.length > 5 && currentPattern.length < 15) {
      clickDelay *= 0.88;
    }
    interval = window.setInterval(loopThroughButtons, clickDelay);
}

function loopThroughButtons() {
  if (i < currentPattern.length) {
    buttonLightUp(currentPattern[i]);
    i++;
  } else {
    clearInterval(interval);
    i = 0;
    setOrTest = "test";
  }
}

$(".startButton").click(function() {
  if (gameOn) {
    startNewGame();
  }
});

function startNewGame() {
    currentPattern = [];
    playerPattern = [];
    clickDelay = 800;
    currentCount = 0;
    i = 0;
    addToPattern();
    displayPattern();
}

function buttonLightUp(buttonNum) {
  var audio = $("#audio" + buttonNum)[0];
  audio.play();
  $("#button" + buttonNum).css("opacity", "0.4").delay(250).queue(function(next) {
    $(this).css("opacity", "1");
    next();
  });
}

$("#button1, #button2, #button3, #button4").click(function() {
  if (setOrTest == "test") {
    var buttonId = $(this).attr("id");
    var buttonPushed = buttonId[buttonId.length - 1];
    $("#button" + buttonPushed).css("opacity", "0.4").delay(150).queue(function(next) {
    $(this).css("opacity", "1");
    next();
  });
    var audio = $("#audio" + buttonPushed)[0];
    audio.playbackRate = 2;
    audio.play();
    playerPattern.push(parseInt(buttonPushed, 10));
    if (testArrayEquality(playerPattern, currentPattern)) {
      nextLevel();
    } else if (playerPattern[playerPattern.length - 1] != currentPattern[playerPattern.length - 1]) {
      incorrect();
    }
  }
});

function nextLevel() {
  if (currentPattern.length == 20) {
    winGame();
  } else {
    setOrTest = "set";
    playerPattern = [];
    addToPattern();
    var inBetweenLevels = setTimeout(displayPattern, 800);
  }
}
  
function incorrect() {
  $(".countDisplay").html("!!");
  if (strict) {
    var loseGame = setTimeout(startNewGame, 800);
  } else {
    setOrTest = "set";
    playerPattern = [];
    displayPattern();
  }
}

function testArrayEquality(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (var j = 0; j < array1.length; j++) {
    if (array1[j] !== array2[j]) {
      return false;  
    }
  }
  return true;
}

$(".strictButton").click(function() {
  if (strict) {
    $(this).css("background-color", "white");
    strict = false;
  } else {
    $(this).css("background-color", "red");
    strict = true;
  }
});

function winGame() {
  $(".gameWon").fadeIn(300).css("display", "block");
}

$(".restartButton").click(function() {
  $(".gameWon").fadeOut(200).css("display", "none");
  $(".startButton").click();
});