function utils() {
  function arrayToObject(arr) {
    if (!arr.reduce) {
      console.log(`tried to reduce ${JSON.stringify(arr)}`);
    }
    const newObj = arr.reduce((acc, val) => {
      acc[val] = 0;
      return acc;
    }, {});
    return newObj;
  }

  function areEqualObj(obj1, obj2) {
    for (const key in obj1) {
      if (!obj2[key]) {
        return false;
      }
    }
    for (const key in obj2) {
      if (!obj1[key]) {
        return false;
      }
    }
    return true;
  }

  function areEqualArr(arr1, arr2) {
    return this.areEqualObj(this.arrayToObject(arr1), this.arrayToObject(arr2));
  }
  return {
    areEqualArr,
    areEqualObj,
    arrayToObject,
  };
}

module.exports = utils();
