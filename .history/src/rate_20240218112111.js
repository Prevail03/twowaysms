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
  reasonmessage: (sender, LinkID) => {
    return {
        to: sender,
        from:'24123',
        message: "Give us the reasons for your rating.",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    };
  },
  successmessage: (sender, LinkID) => {
    return {
        to: sender,
        from:'24123',
        message: "Your feedback has been successfully received. Thanks for your continued support!.",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    };
  },
  services: (sender, LinkID) => {
    return {
        to: sender,
        from:'24123',
        message: "Which Service did you use?\n1. Balance Enquiry\n2. Statements.\n3. Deposits\n4. Claims/Withdrawals\n5. Products & Services",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
    };
  },
  wrongResponse: (sender, LinkID) => {
    return {
      to: sender,
      from:'24123',
      message: "Invalid response:!!!!!!!",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
}
module.exports = rate;