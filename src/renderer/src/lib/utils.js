import totp from "totp-generator";

const POSSIBLE_PERIOD_STEP = 30;

export function getSeconds(date) {
    return date.getSeconds();
}

export function getSecondsRemaining(date, period = 30) {
    return period - (getSeconds(date) % POSSIBLE_PERIOD_STEP);
}

export const INVALID_SECRET_CODE_TEXT = "Invalid secret code";

export function generateCode(secret) {
    let code;
    try {
        code = totp(secret);
    } catch (e) {
        code = INVALID_SECRET_CODE_TEXT;
    }
    return code;
}

export function validateSecret(secret) {
    try {
        totp(secret);
    } catch (e) {
        return false;
    }
    return true;
}

export function getRandomNumber(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}
