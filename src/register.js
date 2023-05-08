const register = {
    newCustomer: (sender) => {
        //send message with credentials
        messageToCustomer = 'Dear Esteemed Customer, Welcome to Octagon Africa. To complete the registration process, please provide us with the following information.';         
        return {
            to: sender,
            from:'24123',
            message: messageToCustomer,
            bulkSMSMode: 0,
            keyword: 'pension'
        };
    },
    enterId: (sender) => ({
        to: sender,
        from:'24123',
        message: "Please enter your ID number:",
        bulkSMSMode: 0,
        keyword: 'pension'
    }),

    failedId: (sender) => ({
        to: sender,
        from:'24123',
        message: "Invalid ID number. Please enter a valid 6-digit ID number"
    }),

    enterEmail: (sender) => ({
        
            to: sender,
            from:'24123',
            message: "ID number verified. Please enter your Email: "
        
    }),
    enterPassword: (sender) => ({
        
        to: sender,
        from:'24123',
        message: "Please enter a 6 or more Characters password: "
    
}),
    enterFirstName: (sender) => ({
        
        to: sender,
        from:'24123',
        message: "Please enter your first name:"
    
    }),
    enterLastName: (sender) => ({
        
        to: sender,
        from:'24123',
        message: "Please enter your Last name:"
    
    })
}

module.exports = register;


