const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const LENGTH = 6

module.exports = function() {
    let res = ""

    while (res.length < LENGTH) {
        res += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
    }

    return res.toUpperCase()
}