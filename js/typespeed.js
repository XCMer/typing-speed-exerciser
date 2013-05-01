$(document).ready(function() {
    var userInput = $('#enteredPhrase'); // Input field holding the user input
    var targetPhrase = $('#targetPhrase');

    var phraseManagerCallback = function(targetString) {
        targetPhrase.html(targetString);
        RUNNER.run(targetString, runnerCallback);
    };

    var runnerCallback = function(timing, right) {
        RESULT_MANAGER.add(timing, right);
        userInput.val("");
    };

    userInput.keyup(function() {
        RUNNER.capture(userInput.val());
    });

    PHRASE_MANAGER.init(phraseManagerCallback);
});

////////////
// Runner //
////////////
var RUNNER = {
    targetString: "", // Target string to run against
    begin: false, // Is this the first character the user is entering (to start the timer)
    callback: null, // Callback to be called when the user is done, giving timing details and rightness
    startTime: 0, // Start time in milliseconds
    endTime: 0, // End time in milliseconds
    timerCount: 0, // Time difference
    stepSize: 10 // Step size for timer count
};

RUNNER.run = function(targetString, callback) {

    RUNNER.targetString = targetString;
    RUNNER.callback = callback;
    RUNNER.begin = true;
    RUNNER.startTime = 0;
    RUNNER.endTime = 0;
    RUNNER.timerCount = 0;
};

RUNNER.stopTimer = function() {
    RUNNER.endTime = (new Date()).getTime();
    RUNNER.timerCount = RUNNER.endTime - RUNNER.startTime;
};

RUNNER.startTimer = function() {
    RUNNER.startTime = (new Date()).getTime();
};

RUNNER.resetTimer = function() {
    RUNNER.startTime = 0;
    RUNNER.endTime = 0;
    RUNNER.timerCount = 0;
};

RUNNER.getTimerCount = function() {

    return RUNNER.timerCount;
};

RUNNER.capture = function(currentString) {
    if (currentString.length == 1) {
        RUNNER.startTimer();

    } else if (currentString.length >= RUNNER.targetString.length) {
        RUNNER.stopTimer();

        if (currentString == RUNNER.targetString) {
            RUNNER.callback(RUNNER.timerCount, true);
        } else {
            RUNNER.callback(RUNNER.timerCount, false);
        }

        RUNNER.resetTimer();
    }
};

////////////////////
// PHRASE MANAGER //
////////////////////

var PHRASE_MANAGER = {
    targetPhrase: $('#targetPhrase'),
    phraseList: $('#phraseList'),
    phrases: $('#phraseList .phrase'),
    callback: null // Callback to be called when a phrase is selected
};

PHRASE_MANAGER.init = function(callback) {

    PHRASE_MANAGER.callback = callback;

    PHRASE_MANAGER.phrases.click(PHRASE_MANAGER.selectPhrase);
};

PHRASE_MANAGER.selectPhrase = function() {
    PHRASE_MANAGER.callback($(this).text());
};

////////////////////
// RESULT MANAGER //
////////////////////

RESULT_MANAGER = {
    resultList: $('#resultList')
};

RESULT_MANAGER.add = function(timing, right) {
    RESULT_MANAGER.resultList.prepend(RESULT_MANAGER.format(timing, right));
};

RESULT_MANAGER.format = function(timing, right) {
    var c = "";
    if (right) {
        c = "right";
    } else {
        c = "wrong";
    }

    return '<li class="result-' + c + '"><strong>Time</strong>: ' + timing + 'ms</li>';
};