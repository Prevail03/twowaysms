const balance = {
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

}
module.exports = balance;