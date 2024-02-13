const products = {
  productsmenu: (sender, LinkID) => ({
    to: sender,
    from:'24123',
    message: "Coming soon...",
    bulkSMSMode: 0,
    keyword: 'pension',
    linkId: LinkID
}),

},
module.exports = register;