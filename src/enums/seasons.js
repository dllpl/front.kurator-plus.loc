import Enum from "@/enums/enum";

class Seasons extends Enum {
  constructor() {
    super();
    this.data = {
      winter: {key: 'winter', name: 'Зима'},
      spring: {key: 'spring', name: 'Весна'},
      summer: {key: 'summer', name: 'Лето'},
      autumn: {key: 'autumn', name: 'Осень'},
    };
  }

  getTitle(key, item) {
    return item?item.name:'Не найдено';
  }

  getKey(key, item) {
    return key;
  }
}

export default new Seasons;
