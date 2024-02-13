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
  startRating: (sender, LinkID) => {
    return {
        to: sender,
        from:'24123',
        message: "Dear Esteemed Customer, Welcome to Octagon Africa. To provide a rating, please provide us with the following information.\nPlease enter your password:",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    };
  },
  reasonmeassage: (sender, LinkID) => {
    return {
        to: sender,
        from:'24123',
        message: "Give us the reasons for your rating.",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    };
  },
}
module.exports = rate;