var page = require('webpage').create(), testindex = 0, shortTime = false, loadInProgress = false, demographics = {};

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
    target(page.content);
    locations(page.content);
    interests(page.content);
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

function target(source) {
  female = singleTrait(source, "fa-female", "%", ">", 50, 0);
  male = singleTrait(source, "fa-male", "%", ">", -100, 140);
  celebrities = singleTrait(source, "Celebrities", "%", ">", -30, 50);
  powerUsers = singleTrait(source, "Power Users<", "%", ">", -30, 50);
  casual = singleTrait(source, "Casual", "%", ">", -30, 50);
  novice = singleTrait(source, "Novice<", "%", ">", -30, 50);
  firstAge = singleTrait(source, "12 - 17", "%", ">", -30, 50);
  secondAge = singleTrait(source, "18 - 24", "%", ">", -30, 50);
  thirdAge = singleTrait(source, "25 - 34", "%", ">", -30, 50);
  fourthAge = singleTrait(source, "35 - 49", "%", ">", -30, 50);
  fifthAge = singleTrait(source, "50 - 64", "%", ">", -30, 50);

  demographics.target = {
                          "gender": {
                            "female": female,
                            "male": male
                            },
                          "age": {
                            "12 - 17": firstAge,
                            "18 - 24": secondAge,
                            "25 - 34": thirdAge,
                            "35 - 49": fourthAge,
                            "50 - 64": fifthAge
                            },
                          "influence": {
                            "celebrities": celebrities,
                            "powerUsers": powerUsers,
                            "casual": casual,
                            "novice": novice
                            }
                        }
/*
    console.log(".............................");
    console.log("Female: " + female);
    console.log("Male: " + male);
    console.log("Celebrities: " + celebrities);
    console.log("Power Users: " + powerUsers);
    console.log("Casual: " + casual);
    console.log("Novice: " + novice);
    console.log("12 - 17: " + firstAge);
    console.log("18 - 24: " + secondAge);
    console.log("25 - 34: " + thirdAge);
    console.log("35 - 49: " + fourthAge);
    console.log("50 - 64: " + fifthAge);
    console.log(".............................");
*/
}

function singleTrait(string, selector, firstsym, lastsym, startpoint, endpoint) {
  index = string.indexOf(selector);
  value = string.slice(index - startpoint, index + endpoint).split(firstsym)[0].split(lastsym)[1];
  return value;
}
// trait param have to be capitalize. indexOf("Top " + trait) returns the first match.
function locations(string)  {
  startLocations = string.indexOf("id=\"allLocations\"");
  endLocations = string.indexOf(">Audience Interests");
  locationsString = string.slice(startLocations, endLocations)
  statesIndex = locationsString.indexOf("Top States");
  citiesIndex = locationsString.indexOf("Top Cities");
  countriesString = locationsString.slice(0, statesIndex);
  statesString = locationsString.slice(statesIndex, citiesIndex);
  citiesString = locationsString.slice(citiesIndex);
  zone(countriesString);
  zone(statesString);
  zone(citiesString);
}

function zone(string) {
  places = string.split("geoLine");
  numberPlaces = places.length - 1;
  while (numberPlaces > 0) {
    place = places[numberPlaces].split(">")[1].split("<")[0].replace(/\s+/g, '');
    percentage = places[numberPlaces].split("%")[0].slice(-5).split(">")[1];
    console.log(place + ": " + percentage);
    numberPlaces--;
  }
}

function interests(string) {
  startInterests = string.indexOf(">Audience Interests");
  endInterests = string.indexOf("id=\"extraDemographics\"");
  interestsString = string.slice(startInterests, endInterests)

  topics = interestsString.split("class=\"barText\">")
  numberTopics = topics.length - 1;
  while (numberTopics > 0) {
    topic = topics[numberTopics].split("<a class=\"grayLink\"")[0].replace(/\s+/g, '');
    percentage = topics[numberTopics].split("class=\"barPercentage\">")[1].replace(/\s+/g, '').split("%</span>")[0];
    console.log(topic + ": " + percentage);
    numberTopics--;
  }
}

