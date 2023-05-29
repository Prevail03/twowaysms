//file that handles all Accounts request information
const forgotPassword = {
  welcomeMessageForgotPassword: (sender, LinkID) => {
    messageToCustomer = 'Welcome to Octagon Africa. If you have forgoten your password , please provide the following details. \nEnter the otp sent your email.';
    return {
        to: sender,
        from:'24123',
        message: messageToCustomer,
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID,
    };
  },
  missingAccount: (sender, LinkID) => {
    messageToCustomer = 'Dear Esteemed You do not have an account with us.Visit our website https://www.octagonafrica.com or send the word pension to 24123 or dowload our app from App Store or Play Store ';
    return {
        to: sender,
        from:'24123',
        message: messageToCustomer,
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID,
    };
  },
}
module.exports = forgotPassword;