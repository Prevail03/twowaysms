//file that handles all Accounts request information
const forgotPassword = {
  welcomeMessageForgotPassword: (sender, LinkID) => {
      messageToCustomer = 'Welcome to Octagon Services. If you have forgoten your password , please provide the following details. \nPlease Enter the otp sent your email.';
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