import Cookies from "js-cookie";

const set = (name: string, value: string, options: Cookies.CookieAttributes = {}) => Cookies.set(name, value, options);

const get = (name: string) => Cookies.get(name);

const remove = (name: string) => Cookies.remove(name);

export default {
    set,
    get,
    remove,
};
