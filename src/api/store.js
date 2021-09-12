const PostFix = {
  ITEM: 'items',
  SYNC_REQUIRED: 'sync-required',
};

export default class Store {
  constructor(storeKey, storage) {
    this._storage = storage;
    this._storeKey = storeKey;
    this._storeItemsKey = `${this._storeKey}-${PostFix.ITEM}`;
    this._storeSyncKey = `${this._storeKey}-${PostFix.SYNC_REQUIRED}`;
  }

  get _storePointsKey() {
    return `${this._storeKey}-${PostFix.ITEM}`;
  }

  get _storeOffersKey() {
    return `${this._storeKey}-${PostFix.OFFERS}`;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeItemsKey)) || {};
    } catch (error) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(
      this._storeItemsKey,
      JSON.stringify(items),
    );
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
      this._storeItemsKey,
      JSON.stringify({
        ...store,
        [key]: value,
      }),
    );
  }
}
