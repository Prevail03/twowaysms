const rate = {
  ratemessage: (sender, LinkID) => {
      return {
          to: sender,
          from:'24123',
          message: "On a scale of 1 to 10. 1 being the least and 10 being the highest, how do you rate our services?",
          bulkSMSMode: 0,
          keyword: 'pension',
          linkId: LinkID
      };
  },
  startClaims: (sender, LinkID) => {
    return {
        to: sender,
        from:'24123',
        message: "Dear Esteemed Customer, Welcome to Octagon Africa. To procces a claim, please provide us with the following information.\nPlease enter your password:",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    };
  },
}
module.exports = rate;