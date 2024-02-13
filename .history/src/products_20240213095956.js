const products = {
  productsmenu: (sender, LinkID) => ({
    to: sender,
    from:'24123',
    message: "Our products and services are: \n1. Pension Services.\n2. Insurance.\n3. Trust.\n4. Training.\n5. Elections.",
    bulkSMSMode: 0,
    keyword: 'pension',
    linkId: LinkID
  }),

},
module.exports = products;

const register = {
  newCustomer: (sender, LinkID) => {
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
      message: "Welcome To Octagon Africa you can access our services by sending the word pension:",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
  }),
  menuMessage: (sender, LinkID) => ({
      to: sender,
      from:'24123',
      message: "Welcome to Octagon: \n2. Statements.  \n4. Claims/Withdrawals \n5. Products  & Services\n98. Forgot Password \n99. Home ",
      // message: "Welcome to Octagon:\n1. Balance Enquiry\n2. Statements.\n3. Deposits\n4. Claims/Withdrawals\n5. Products & Services\n6. My Account\n7. Help\n8. Rate our Services\n9. Reset Password \n10. Deactivate Account\n 98. Forgot Password",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
  }),
  wrongMenuValue: (sender, LinkID) => ({
      to: sender,
      from:'24123',
      message: "Coming soon...",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
  }),
}
module.exports = register;