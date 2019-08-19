import { browser, element, by, By, protractor, ElementArrayFinder, ElementFinder } from "protractor";

describe('Protractor Demo App', function() {
    it('should have a title', function() {
       browser.ignoreSynchronization=true;
      browser.get('https://google.com');
  
     browser.sleep(20000)
      
    });
    
    it('Login to IMDB', function() {
       browser.ignoreSynchronization=true;
       browser.get('https://www.imdb.com');
  
       browser.sleep(20000)
      
    });
    
    it('Login to Facebook', function() {
       browser.ignoreSynchronization=true;
       browser.get('https://www.facebook.com/');
       browser.sleep(20000)
       element(by.xpath('//input[@type="email"]')).sendKeys('k.nandini95@gmail.com')
       browser.sleep(1000)
       element(by.id('pass')).sendKeys('random11')
       element(by.xpath('//input[@value="Log In"]')).click()
       expect(element(by.xpath('//a[text()="Forgotten password?"]')).isDisplayed()).toBe(false)
    });
    
  });