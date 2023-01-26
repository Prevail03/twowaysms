const validateId = (idNumber) => {
   return /^\d{5,7}$/.test(idNumber)
}
module.exports = validateId;