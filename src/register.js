const generateRandom4DigitNumber = require ('./generateRandom4DigitNumber.js');

const register = (sender) => {
    //generate username and pin
    user = {
        pin: generateRandom4DigitNumber()
    };
    //send message with credentials
    messageToCustomer = 'Hello Our Esteemed Customer, Welcome to Octagon Africa your credentials are: Username - ' + sender + ' Pin- ' + user.pin + '.';
    return {
        to: sender,
        from:'20880',
        message: messageToCustomer
    };
}

module.exports = register