/* global console, localStorage, sessionStorage, Storage */

/**
 * [TRUSTORAGE is a wrapper for localStorage which allows easy storage and retrieval of objects]
 * @param {LocalStorage || Object} storageType in which to store data
 * @param {[Object]} root      [Root of key within storage in which to set and get data]
 * @param {[String]} root.key  [key for storage]
 * @param {[Object || Array]} root.type [object or array in which to store data]
 */
class TruStorage {
  constructor (storageType, root) {
    this.storageType = storageType || localStorage

    if (root) {
      if (typeof root === 'string') {
        root = {key: root, type: {}}
      }
      this.storageType[root.key] = this.storageType[root.key] || JSON.stringify(root.type)
    }

    this.prefix = root ? (root.key + '.') : ''
  }

  setItem (str, value, modifier) {
    const fetchPath = TruStorage._readLocalObj.call(this, str, value, modifier)
    return fetchPath
  }

  getItem (str) {
    if (!str && !this.prefix.length) {
      return this.storageType
    } else if (this.prefix && !str) {
      return TruStorage._makeFormat(this.storageType[this.prefix.replace('.', '')])
    } else {
      return TruStorage._readLocalObj.call(this, str)
    }
  }

  clear () {
    if (this.storageType instanceof Storage) {
      this.storageType.clear()
    } else {
      this.storageType = {}
    }
  }

  removeItem (str) {
    if (this.storageType instanceof Storage) {
      this.storageType.removeItem(str.split('.')[0])
    } else {
      delete this.storageType[str.split('.')[0]]
    }
  }

  get length () {
    return this.storageType.length
  }

  static _makeFormat (str) {
    let formatted = str

    try {
      if (!(str instanceof Array)) {
        formatted = JSON.parse(str)
      }
    } catch (e) {
      /* console.log('truStorage not passed a json object') */
    }
    return formatted
  }

  static _readLocalObj (str, setVal, modifier) {
    str = str || ''
    if (this.prefix.length) {
      str = this.prefix + str
    }

    if (typeof setVal === 'object') {
      setVal = JSON.stringify(setVal)
    }
    if (typeof modifier === 'undefined') {
      modifier = false
    }

    const strArr = str.split('.')
    const strArrLn = strArr.length
    let currentLevel = this.storageType // Depth level starts at this.storageTypeRoot
    const rootKey = strArr[0]

    let objCopy = {}
    let isSetMode = false

    if (typeof setVal !== 'undefined') {
      isSetMode = true
    }

    for (let i = 0; i < strArrLn; i++) {
      let key = strArr[i]

      if (typeof currentLevel === 'undefined' ||
        typeof currentLevel !== 'object') {
        console.warn('cannot append key to non object')
        return null
      }

      if (isSetMode && i === strArrLn - 1) {
        if (modifier) {
          let r = TruStorage._makeFormat(currentLevel[key])
          r[modifier].apply(r, JSON.parse(setVal))
          setVal = r
        }
        currentLevel[key] = setVal
      }

      // Generate objects if needed
      if (isSetMode && !(typeof currentLevel === 'object' && key in currentLevel)) {
        if (i !== strArrLn - 1) {
          currentLevel[key] = {}
        } else {
          return null
        }
      }
      currentLevel = TruStorage._makeFormat(currentLevel[key])
      if (i === 0) {
        objCopy = currentLevel
      }
    }

    if (isSetMode) {
      this.storageType[rootKey] = JSON.stringify(objCopy)
    }
    return currentLevel
  }
}

function getStorageObj (storageType) {
  const storageObj = new TruStorage((() => {
    try {
      storageType.setItem('test', 'test')
      storageType.removeItem('test')
      return storageType
    } catch (e) {
      return {}
    }
  })())

  return {
    setItem: storageObj.setItem.bind(storageObj),
    getItem: storageObj.getItem.bind(storageObj),
    removeItem: storageObj.removeItem.bind(storageObj),
    clear: storageObj.clear.bind(storageObj)
  }
}

const truStorage = (() => {
  return getStorageObj(localStorage)
})()

const truSessionStorage = (() => {
  return getStorageObj(sessionStorage)
})()

export {
  truStorage,
  truSessionStorage
}
