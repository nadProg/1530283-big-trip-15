const PostFix = {
  POINTS: 'Points',
  OFFERS: 'Offers',
  DESTINATIONS: 'Destinations',
  // SYNC_REQUIRED: 'sync-required',
};

export default class Store {
  constructor(storeKey, storage) {
    this._storage = storage;
    this._storeKey = storeKey;
  //   this._storeSyncKey = `${this._storeKey}-${PostFix.SYNC_REQUIRED}`;
  }

  get _storePointsKey() {
    return `${this._storeKey}-${PostFix.POINTS}`;
  }

  get _storeOffersKey() {
    return `${this._storeKey}-${PostFix.OFFERS}`;
  }

  get _storeDestinationsKey() {
    return `${this._storeKey}-${PostFix.DESTINATIONS}`;
  }

  // get isSyncRequired() {
  //   const isSyncRequired = this._storage.getItem(this._storeSyncKey);
  //   return JSON.parse(isSyncRequired).isSyncRequired || false;
  // }

  // set isSyncRequired(required) {
  //   const isSyncRequired = JSON.stringify({ isSyncRequired: required });
  //   this._storage.setItem(this._storeSyncKey, isSyncRequired);
  // }

  getItems(postfix) {
    try {
      return JSON.parse(this._storage.getItem(this[`_store${postfix}Key`])) || {};
    } catch (error) {
      return {};
    }
  }

  setItems(items, postfix) {
    this._storage.setItem(
      this[`_store${postfix}Key`],
      JSON.stringify(items),
    );
  }

  // setItem(key, value) {
  //   const store = this.getItems();

  //   this._storage.setItem(
  //     this._storeItemsKey,
  //     JSON.stringify({
  //       ...store,
  //       [key]: value,
  //     }),
  //   );
  // }
}
