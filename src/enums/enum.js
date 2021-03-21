class Enum {
  constructor() {
    this.data = {};
  }

  /**
   *
   * @param {Object} items
   * @return {Array}
   * @private
   */
  _makeSelectOptions(items = null){
    let Array = [];
    for (let key in items) {
      if (items.hasOwnProperty(key)) {
        let text = items[key];
        Array.push({'value': this.getKey(key,text), 'text':  this.getTitle(key,text)});
      }
    }
    return Array;
  }

  getSelectOptions(){
    return  this._makeSelectOptions(this.data);
  }

  getObjectByKey(key){
    if(this.data.hasOwnProperty(key)){
      return this.data[key];
    }
  }

  getTitleByKey(key){
    return this.getTitle(key,this.getObjectByKey(key))
  }

  getData(){
    return this.data;
  }

  getTitle(key,item){
    return item;
  }

  getKey(key,item){
    return key;
  }
}

export default Enum;
