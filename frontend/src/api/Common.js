export default class Common {
    static isNumeric(str) {
        return /^-?\d+$/.test(str);
    }
}

// TODO: encode
export const encodeLocal = (plaintext) => {
    return plaintext
};

// TODO: decode
export const decodeLocal = (ciphertext) => {
    return ciphertext
};

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
};

export const get_format_date = (date) => {
    const dd = new Date(date)
    return new Date(Number(dd) - new Date().getTimezoneOffset() * 60000).toLocaleString()
};
