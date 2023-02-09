//file that handles all Accounts request information
const account = {
    welcomeMessageAccount: (sender) => {
        messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. To check you account, please provide the following details ... ';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
     
    },
    provideUserName: (sender) => {
        messageToCustomer = 'Please enter your username.';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
    },
    providePassword: (sender) => {
        messageToCustomer = 'Please Enter your password.';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
    },
    confirmLogin: (sender) => {
        messageToCustomer = 'Login Successfull';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
    },
    enterUserID: (sender) => {
        messageToCustomer = 'Enter User ID';
        return {
            to: sender,
            from:'20880',
            message: messageToCustomer
        };
    },
    wrongResponse: (sender) => {
        return {
            to: sender,
            from:'20880',
            message: "Invalid response:!!"
        };
    },
    Response400: (sender) => {
        return {
            to: sender,
            from:'20880',
            message: "Invalid Details!!. Check your details and please try again Later"
        };
    },
    Response: (sender) => {
        return {
            to: sender,
            from:'20880',
            message: "Invalid Details!!. Check your details and please try again Later"
        };
    },
    
}
module.exports = account;