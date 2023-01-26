const generateRandom4DigitNumber = require ('./generateRandom4DigitNumber.js');
const customersName = require('../index.js');

const register = {
    newCustomer: (sender) => {
        
        
        
        let generatedPin = generateRandom4DigitNumber();

        //send message with credentials
        messageToCustomer = 'Hello Our Esteemed Customer, Welcome to Octagon Africa your credentials are: Username - ' + sender + ' Pin- ' + generatedPin + '.';

         

        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
    },

    enterId: (sender) => ({
        to: sender,
        from:'20880',
        message: "Please enter your ID number:"
    }),

    enterCounty: (sender) => ({
        
            to: sender,
            from:'20880',
            message: "ID number verified. Please enter your county: "
        
    }),
    enterName: (sender) => ({
        
        to: sender,
        from:'20880',
        message: "Please enter your full name:"
    
    }),
    congratulations: (sender) => ({
            
        to: sender,
        from:'20880',
        message: "Congratulations!! "+ customersName +".  You have successfully registered with Octagon Africa."

    })
}

module.exports = register;


