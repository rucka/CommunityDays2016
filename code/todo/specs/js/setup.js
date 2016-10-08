mocha.setup('bdd');
mocha.slow("5s");
mocha.timeout("30s"); //so that tests don't fail with a false positive while waiting for e.g a heroku dyno to spin up
window.expect = chai.expect;

targetRootUrl = '/api';

if( targetRootUrl ){
  $("#target-info .target-url").text(targetRootUrl);
  $("#target-chooser").hide();

  defineSpecsFor(targetRootUrl);

  mocha.checkLeaks();
  var runner = mocha.run();
}else{
  $("#target-info").hide();
}
