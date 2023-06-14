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
}
module.exports = claims;


