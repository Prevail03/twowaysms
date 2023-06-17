const claims = {
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
  invalidResponse: (sender, LinkID) => {
    return {
        to: sender,
        from:'24123',
        message: "Invalid response please enter a valid response as provides in the menu!!",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    };
  },
}
module.exports = claims;


