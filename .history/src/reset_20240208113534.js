const reset={
    welcomeMessage: (sender,LinkID) => {
        messageToCustomer = 'Dear Esteemed Customer, Welcome to Octagon Africa. To reset your account password, please provide the following details. \nPlease enter your email address.';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    enterEmail: (sender,LinkID) => {
        messageToCustomer = 'Please enter your email address. ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    enterCurrentPassword: (sender, LinkID) => {
        messageToCustomer = 'Please enter your Current password ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    verifyPassword: (sender,LinkID) => {
        messageToCustomer = 'Account Verified ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    enterOTP: (sender,LinkID) => {
        messageToCustomer = 'Account Verified.\nPlease enter the OTP Sent to your email account ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    enterNewPassword: (sender,LinkID) => {
        messageToCustomer = 'Please enter Your new Password ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    error400: (sender,LinkID) => {
        messageToCustomer = 'Invalid Details!!. Check your details and please try again Later ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
     
    },
    error500: (sender,LinkID) => {
        messageToCustomer = 'Invalid Details!!. Check your details and please try again Later ';
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
     
    },
    confirmation: (sender,LinkID) => {
        messageToCustomer = "Your password has been successfully changed .If this wasn't you, contact us at support@octagonafrica.com ";
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    deactivateAccount: (sender,LinkID) => {
        messageToCustomer = "Dear Esteemed Customer, Welcome to Octagon Africa. To deactivate your account Password, please provide the following details. \nEnter your national ID number. ";
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
}
module.exports=reset;