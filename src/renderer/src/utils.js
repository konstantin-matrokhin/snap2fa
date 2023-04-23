import totp from "totp-generator";

const POSSIBLE_PERIOD_STEP = 30;

export function getSeconds(date) {
    return date.getSeconds();
}

export function getSecondsRemaining(date, period = 30) {
    return period - (getSeconds(date) % POSSIBLE_PERIOD_STEP);
}

export const INVALID_CODE_ERROR = "Invalid secret code";

export function generateCode(secret) {
    let code;
    try {
        code = totp(secret);
    } catch (e) {
        code = INVALID_CODE_ERROR;
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
