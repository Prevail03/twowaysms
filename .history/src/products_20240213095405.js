const products = {
  productsmenu: (sender, LinkID) => ({
    to: sender,
    from:'24123',
    message: "Our products and services are: \n1. Pension Services.\n2. Insurance.\n3. Trust.\n4. Training.\n5. Elections ",
    bulkSMSMode: 0,
    keyword: 'pension',
    linkId: LinkID
  })

},
module.exports = products;