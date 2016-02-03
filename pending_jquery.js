var page = require('webpage').create(), testindex = 0, shortTime = false, loadInProgress = false;

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onError = function(msg, trace) {
  var msgStack = ['ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }
  console.error(msgStack.join('\n'));
};

page.onResourceError = function(resourceError) {
  console.log('Unable to load resource (#' + resourceError.id + ' URL:' + resourceError.url + ')');
  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
};

// http://phantomjs.org/api/webpage/handler/on-resource-timeout.html
page.onResourceTimeout = function(request) {
    console.log('Response Timeout (#' + request.id + '): ' + JSON.stringify(request));
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
    }); 
    shortTime = true;
  },  
  function() {
    page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
      console.log($("fa-female").nextSibling.innerHTML);
      shortTime = true;
    });
  },
  function() {
    page.render('profile.jpg');
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
