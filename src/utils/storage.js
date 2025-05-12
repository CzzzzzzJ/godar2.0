const localStorage = {
  clear() {
    window.localStorage.clear();
  },
  remove(key) {
    window.localStorage.removeItem(key);
  },
  set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const value = window.localStorage.getItem(key);

    try {
      return value != null ? JSON.parse(value) : value;
    } catch (err) {
      // err
      return value;
    }
  },
};

export default localStorage;
