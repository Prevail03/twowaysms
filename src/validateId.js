const validateId = (idNumber) => {
   return /^\d{5,9}$/.test(idNumber)
}
module.exports = validateId;