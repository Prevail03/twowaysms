const sql = require('mssql');
var Client = require('node-rest-client').Client;

const {updatePassword, updateDescription} = require('./Database/DepositDB');