import Cookies from "js-cookie";

const set = (name: string, value: string) => Cookies.set(name, value);

const get = (name: string) => Cookies.get(name);

const remove = (name: string) => Cookies.remove(name);

export default {
    set,
    get,
    remove
};
