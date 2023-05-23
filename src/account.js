//file that handles all Accounts request information
const account = {
    welcomeMessageAccount: (sender, LinkID) => {
        messageToCustomer = ' Dear Esteemed Customer, Welcome to Octagon Services. To check you account, please provide the following details. \nPlease enter your username. ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID,
        };
     
    },
    provideUserName: (sender, LinkID) => {
        messageToCustomer = 'Please enter your username.';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    providePassword: (sender, LinkID) => {
        messageToCustomer = 'Please Enter your password.';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    confirmLogin: (sender, LinkID) => {
        messageToCustomer = 'Login Successfull';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    enterRequestStatements: (sender, LinkID) => {
        messageToCustomer = 'Enter User ID';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    wrongResponse: (sender, LinkID) => {
        return {
            to: sender,
            from:'24123',
            message: "Invalid response:!!",
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    Response400: (sender, LinkID) => {
        return {
            to: sender,
            from:'24123',
            message: "Invalid Details!!. Check your details and please try again Later",
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    Response: (sender, LinkID) => {
        return {
            to: sender,
            from:'24123',
            message: "Invalid Details!!. Check your details and please try again Later",
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    providePeriodName: (sender, LinkID) => {
        return {
            to: sender,
            from:'24123',
            message: "Please enter the period name as provided in the above message",
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
}
module.exports = account;