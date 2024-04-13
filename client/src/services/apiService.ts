const fetchWrap = async (url: RequestInfo | URL, options: RequestInit) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            const msg = await res.json();
            throw msg;
        }

        try {
            // return res.text().then((str) => (str ? JSON.parse(str) : {})); // fix empty response
            return res.json();
        } catch (error) {
            console.log("fetchWrap error says: ", error);
            return res;
        }
    } catch (err) {
        throw err;
    }
};

const getOptions = (config: RequestInit, method: RequestInit["method"] = "get", payload?: object) => {
    const options: RequestInit = { method: method.toUpperCase(), credentials: "include", ...config };
    const headers = new Headers();

    if (payload) {
        headers.set("Content-Type", "application/json");
        options.body = JSON.stringify(payload);
    }

    options.headers = headers;

    return options;
};

export const isCancelledErrorProcessor = (e: any) => {
    if (e.code === 20 && e.name === "AbortError") {
        return;
    }

    throw e;
};

const ApiService = {
    get: (url: RequestInfo | URL, config: RequestInit = {}) => fetchWrap(url, getOptions(config)),
    post: (url: RequestInfo | URL, data: object, config: RequestInit = {}) => fetchWrap(url, getOptions(config, "post", data)),
    put: (url: RequestInfo | URL, data: object, config: RequestInit = {}) => fetchWrap(url, getOptions(config, "put", data)),
    del: (url: RequestInfo | URL, config: RequestInit = {}) => fetchWrap(url, getOptions(config, "delete")),
    patch: (url: RequestInfo | URL, data: object, config: RequestInit = {}) => fetchWrap(url, getOptions(config, "patch", data)),
};

export default ApiService;
