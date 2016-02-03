var page = require('webpage').create(), testindex = 0, shortTime = false, loadInProgress = false;

page.onConsoleMessage = function(msg) {
  console.log(msg);
};


page.onLoadStarted = function() {
  loadInProgress = true;
  console.log("load started");
};

page.onLoadFinished = function() {
  loadInProgress = false;
  console.log("load finished");
};

var steps = [
  function() {
    //Load Login Page
    page.open("http://es.klear.com/sign-in");
    shortTime = true;
  },
  function() {
    //Enter Credentials
    page.evaluate(function() {
      document.querySelector("#inputEmail").value = 'info@fluvip.com';
      document.querySelector("#inputPassword").value = 'Exito123$';
    });
    shortTime = false;
  }, 
  function() {
    //Login
    page.evaluate(function() {
      document.querySelector("#submitButton").click();
    });
    shortTime = false;
  }, 
  function() {
    page.open("http://es.klear.com/profile/juanitakremer/demographics", function()  {}); 
    shortTime = true;
  },
  function() {
    female = singleTrait(page.content, "fa-female", "%", ">", 50, 0);
    male = singleTrait(page.content, "fa-male", "%", ">", -100, 140);
    celebrities = singleTrait(page.content, "Celebrities", "%", ">", -30, 50);
    powerUsers = singleTrait(page.content, "Power Users<", "%", ">", -30, 50);
    casual = singleTrait(page.content, "Casual", "%", ">", -30, 50);
    novice = singleTrait(page.content, "Novice<", "%", ">", -30, 50);
    firstAge = singleTrait(page.content, "12 - 17", "%", ">", -30, 50);
    secondAge = singleTrait(page.content, "18 - 24", "%", ">", -30, 50);
    thirdAge = singleTrait(page.content, "25 - 34", "%", ">", -30, 50);
    fourthAge = singleTrait(page.content, "35 - 49", "%", ">", -30, 50);
    fifthAge = singleTrait(page.content, "50 - 64", "%", ">", -30, 50);
    
    console.log(".............................");
    console.log("Female: " + female);
    console.log("Male: " + male);
    console.log("Celebrities: " + celebrities);
    console.log("Casual: " + casual);
    console.log("Novice: " + novice);
    console.log("12 - 17: " + firstAge);
    console.log("18 - 24: " + secondAge);
    console.log("25 - 34: " + thirdAge);
    console.log("35 - 49: " + fourthAge);
    console.log("50 - 64: " + fifthAge);
    console.log(".............................");
    shortTime = true;
  }
];

interval = setInterval(function() {
  if (!loadInProgress && typeof steps[testindex] == "function") {
    console.log("step " + (testindex + 1));
    steps[testindex]();
    testindex++;
  }
  if (typeof steps[testindex] != "function") {
    console.log("test complete!");
    phantom.exit();
  }
}, shortTime ? 50 : 60000);


function singleTrait(string, selector, firstSym, lastSym, startPoint, endPoint) {
  index = string.indexOf(selector);
  value = string.slice(index - startPoint, index + endPoint).split(firstSym)[0].split(lastSym)[1];
  return value;
}
