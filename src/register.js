const register = {
    newCustomer: (sender, LinkID) => {
        //send message with credentials
        const messageToCustomer = 'Dear Esteemed Customer, Welcome to Octagon Africa. To complete the registration process, please provide us with the following information.\nPlease enter your ID number:';    
        return {
            to: sender,
            from:'24123',
            message: "Dear Esteemed Customer, Welcome to Octagon Africa. To complete the registration process, please provide us with the following information.\nPlease enter your ID number:",
            bulkSMSMode: 0,
            keyword: 'pension',
            linkId: LinkID
        };
    },
    enterId: (sender, LinkID) => ({
        to: sender,
        from:'24123',
        message: "Please enter your ID number:",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    }),

    failedId: (sender,LinkID) => ({
        to: sender,
        from:'24123',
        message: "Invalid ID number. Please enter a valid 6-digit ID number",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    }),

    enterEmail: (sender,LinkID ) => ({
        to: sender,
        from:'24123',
        message: "ID number verified. Please enter your Email: ",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID 
    }),
    enterPassword: (sender,LinkID) => ({        
        to: sender,
        from:'24123',
        message: "Please enter a 6 or more Characters password: ",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID   
    }),
    enterFirstName: (sender,LinkID) => ({   
        to: sender,
        from:'24123',
        message: "Please enter your first name:",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    }),
    enterLastName: (sender, LinkID) => ({    
        to: sender,
        from:'24123',
        message: "Please enter your Last name:",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    }),
    defaultMessage: (sender, LinkID) => ({
        to: sender,
        from:'24123',
        message: "Welcome To Octagon Africa you can access our services by sending the word Register,Balance, Accounts, Reset,Delete:",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    }),
    menuMessage: (sender, LinkID) => ({
        to: sender,
        from:'24123',
        message: "Dear Esteemed Customer, Welcome to Octagon Africa:\n 1. Generate Member Statement. \n 2. Reset Password.  \n 3. Deactivate Account.",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    })
}

module.exports = register;


