
const products = {
  productsmenu: (sender, LinkID) => {
      return {
        to: sender,
        from:'24123',
        message: "Our products and services are: \n1. Pension Services.\n2. Insurance.\n3. Trust.\n4. Training.\n5. Elections.",
        bulkSMSMode: 0,
        keyword: 'pension',
        linkId: LinkID
      };
  },
  pensionProducts: (sender, LinkID) => {
    return {
      to: sender,
      from:'24123',
      message: "Our pension products are : \n1. IPP",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
  enterlastname: (sender, LinkID) => {
    return {
      to: sender,
      from:'24123',
      message: "Enter your last name:",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
  enterfirstname: (sender, LinkID) => {
    return {
      to: sender,
      from:'24123',
      message: "Enter your first name:",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
  enteremail: (sender, LinkID) => {
    return {
      to: sender,
      from:'24123',
      message: "Enter your email(xx@xx.xx):",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
  enternationalID: (sender, LinkID) => {
    return {
      to: sender,
      from:'24123',
      message: "Enter your National ID:",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
  methodofpayment: (sender, LinkID) => {
    return {
      to: sender,
      from:'24123',
      message: "Enter your prefered method of payment: \n1. M-Pesa \n2. Salary Deduction",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
  modefpayment: (sender, LinkID) => {
    return {
      to: sender,
      from:'24123',
      message: "Enter your prefered mode of payment: \n1. Monthly \n2. Quaterly \n3.Half Yearly \n4.Yearly",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
  wrongresponse: (sender, LinkID) => {
    return {
      to: sender,
      from:'24123',
      message: "Invalid response",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
  comingsoon: (sender, LinkID) => {
    return {
      to: sender,
      from:'24123',
      message: "Coming Soon.....",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
  
}
module.exports = products;