describe('Protractor Demo App', function() {
  it('should have a title', function() {
	 browser.ignoreSynchronization=true;
    browser.get('https://google.com');

   browser.sleep(20000)
	
  });
});