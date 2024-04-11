// todo read cookies instead

const user = localStorage.getItem(process.env.REACT_APP_TOKEN_LOCAL_STORAGE!);

const fetchWrap = async (url: RequestInfo | URL, options: RequestInit) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            let msg = await res.json();
            throw msg;
        }

        try {
            return res.json();
        } catch (error) {
            console.log("fetchWrap error says: ", error);
            return res;
        }
    } catch (err) {
        throw err;
    }
};

const getOptions = (method: RequestInit["method"] = "get", payload: object = {}) => {
    const options: RequestInit = { method: method.toUpperCase(), credentials: "include" };
    const headers = new Headers();

    if (user) {
        headers.set("X-Authorization", user);
    }

    if (payload) {
        headers.set("Content-Type", "application/json");
        options.body = JSON.stringify(payload);
    }

    options.headers = headers;

    return options;
};

const ApiService = {
    get: (url: RequestInfo | URL) => fetchWrap(url, getOptions()),
    post: (url: RequestInfo | URL, data: object) => fetchWrap(url, getOptions("post", data)),
    put: (url: RequestInfo | URL, data: object) => fetchWrap(url, getOptions("put", data)),
    del: (url: RequestInfo | URL) => fetchWrap(url, getOptions("delete")),
    patch: (url: RequestInfo | URL, data: object) => fetchWrap(url, getOptions("patch", data)),
};

export default ApiService;
