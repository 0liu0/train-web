export class Tool {
  /**
   * 空校验 null或""都返回true
   */
  static isEmpty(obj) {
    if ((typeof obj === 'string')) {
      return !obj || obj.replace(/\s+/g, "") === "";
    } else {
      return (!obj || JSON.stringify(obj) === "{}" || obj.length === 0);
    }
  }

  /**
   * 非空校验
   */
  static isNotEmpty(obj) {
    return !this.isEmpty(obj);
  }

  /**
   * 对象复制
   * @param obj
   */
  static copy(obj) {
    if (Tool.isNotEmpty(obj)) {
      return JSON.parse(JSON.stringify(obj));
    }
  }

  /**
   * 使用递归将数组转为树形结构
   * 父ID属性为parent
   */
  static array2Tree(array, parentId) {
    if (Tool.isEmpty(array)) {
      return [];
    }

    const result = [];
    for (let i = 0; i < array.length; i++) {
      const c = array[i];
      if (Number(c.parent) === Number(parentId)) {
        result.push(c);

        // 递归查看当前节点对应的子节点
        const children = Tool.array2Tree(array, c.id);
        if (Tool.isNotEmpty(children)) {
          c.children = children;
        }
      }
    }
    return result;
  }

  /**
   * 随机生成[len]长度的[radix]进制数
   * @param len
   * @param radix 默认62
   * @returns {string}
   */
  static uuid(len, radix = 62) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid = [];
    radix = radix || chars.length;

    for (let i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }

    return uuid.join('');
  }
  static getFromSessionStorage(key) {
    let value = sessionStorage.getItem(key)
    if (value && typeof(value) !== 'undefined' && value !== 'undefined') {
      return JSON.parse(value)
    }
  }
  static setFromSessionStorage(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data))
  }
  static removeFromSessionStorage(key) {
    sessionStorage.removeItem(key)
  }
  static clearAllSessionStorage() {
    sessionStorage.clear()
  }
}
