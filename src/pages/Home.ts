import { browser, by, By, ElementFinder, ElementArrayFinder, promise } from "protractor";
import { wrapperElement as element } from "../framework/elementWrapper/Element-Factory";

export class Home {

    body = element(by.css('app-home'));
    addFavouriteTile = this.body.element(by.css('app-favoriteitem[draggable="false"] #gestureevent.kx-card__body'));
    tilesCollection = this.body.all(by.css('app-favoriteitem[draggable="true"]'));
    private appFavouriteSearchContainer = this.body.element(by.css('app-favorites-search'));
    appFavouriteSearchInput = this.appFavouriteSearchContainer.element(by.id('SearchField'));
    appFavouriteSearchResults = this.appFavouriteSearchContainer.all(by.id('searchfavoritetext'));
    tileDeleteIcon = this.body.element(by.css('i.kx-card__icon.ng-star-inserted'));

    getSearchListItem(itemName: string) {
        return this.appFavouriteSearchResults.filter(elem => elem.getText().then(txt => txt == itemName)).first();
    }
    getTile(tileName: string) {
        return this.tilesCollection.filter(elem => elem.getText().then(txt => txt.indexOf(tileName) != -1)).first();
    }
}