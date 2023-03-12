const register = {
    newCustomer: (sender) => {
        //send message with credentials
        messageToCustomer = 'Hello Our Esteemed Customer, Welcome to Octagon Africa. To complete the registration process, please provide us with the following information...';         
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

    enterEmail: (sender) => ({
        
            to: sender,
            from:'20880',
            message: "ID number verified. Please enter your Email: "
        
    }),
    enterPassword: (sender) => ({
        
        to: sender,
        from:'20880',
        message: "Please enter a 6 or more Characters password: "
    
}),
    enterFirstName: (sender) => ({
        
        to: sender,
        from:'20880',
        message: "Please enter your first name:"
    
    }),
    enterLastName: (sender) => ({
        
        to: sender,
        from:'20880',
        message: "Please enter your Last name:"
    
    })
}

module.exports = register;


