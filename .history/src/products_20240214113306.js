
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
      message: "Enter your first name:",
      bulkSMSMode: 0,
      keyword: 'pension',
      linkId: LinkID
    };
  },
  
}
module.exports = products;