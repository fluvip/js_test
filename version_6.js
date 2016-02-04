var page = require('webpage').create(), testindex = 0, shortTime = false, loadInProgress = false;
var demographics = {
                 "gender": {},
                 "age": {},
                 "influence": {},
                 "contries": {},
                 "states": {},
                 "cities": {},
                 "topics": {}
                 }

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
    console.log(JSON.stringify(demographics));
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
  female = singleTrait(source, "female", "%", ">", 50, 0);
  male = singleTrait(source, "male", "%", ">", -100, 140);
  celebrities = singleTrait(source, "Celebrities", "%", ">", -30, 50);
  powerUsers = singleTrait(source, "Power Users<", "%", ">", -30, 50);
  casual = singleTrait(source, "Casual", "%", ">", -30, 50);
  novice = singleTrait(source, "Novice<", "%", ">", -30, 50);
  firstAge = singleTrait(source, "12 - 17", "%", ">", -30, 50);
  secondAge = singleTrait(source, "18 - 24", "%", ">", -30, 50);
  thirdAge = singleTrait(source, "25 - 34", "%", ">", -30, 50);
  fourthAge = singleTrait(source, "35 - 49", "%", ">", -30, 50);
  fifthAge = singleTrait(source, "50 - 64", "%", ">", -30, 50);

  append_value("gender", "female", female);
  append_value("gender", "male", male);
  append_value("influence", "celebrities", celebrities);
  append_value("influence", "powerUser", powerUsers);
  append_value("influence", "casual", casual);
  append_value("influence", "novice", novice);
  append_value("age", "12 - 17", firstAge);
  append_value("age", "18 - 24", secondAge);
  append_value("age", "25 - 34", thirdAge);
  append_value("age", "35 - 49", fourthAge);
  append_value("age", "50 - 64", fifthAge);
}

function singleTrait(string, selector, firstsym, lastsym, startpoint, endpoint) {
  index = string.indexOf(selector);
  value = string.slice(index - startpoint, index + endpoint).split(firstsym)[0].split(lastsym)[1];
  return value;
}

function append_value(group, key, value) {
  demographics[group][key] = value;
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
  zone("contries", countriesString);
  zone("states", statesString);
  zone("cities", citiesString);
}

function zone(area, string) {
  places = string.split("geoLine");
  numberPlaces = places.length - 1;
  while (numberPlaces > 0) {
    place = places[numberPlaces].split(">")[1].split("<")[0].replace(/\s+/g, '');
    percentage = places[numberPlaces].split("%")[0].slice(-5).split(">")[1];
    append_value(area, place, percentage);
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
    append_value("topics", topic, percentage);
    numberTopics--;
  }
}
