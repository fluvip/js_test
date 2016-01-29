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
    page.open("http://es.klear.com/profile/juanitakremer/demographics", function()  {
      page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
      });
    }); 
    shortTime = true;
  },
  function() {
    console.log(parseInt($(".fa-male").nextSibling.innerHTML.slice(0,-1)));
/*
    page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
      female = parseInt($(".fa-female").nextSibling.innerHTML);
      male = parseInt($(".fa-male").nextSibling.innerHTML);
    }
    console.log('Female: ' + female);
    console.log('Male: ' + male);
*/
    shortTime = false;
  },
  function() {
    page.render('sísícolombiasísíivan.jpg');
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
