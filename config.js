exports.config = {
  framework: 'jasmine2',
  directConnect: true,
 // seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js'] ,   
  onPrepare: function() {
    var AllureReporter = require('C:\\Users\\iotSensorConfi\\AppData\\Roaming\\npm\\node_modules\\jasmine-allure-reporter');
    jasmine.getEnv().addReporter(new AllureReporter({
      resultsDir: 'allure-results'
    }));
  }
}
