exports.randomToken = () => {
    return Math.round((new Date().valueOf() * Math.random())) + '';
}