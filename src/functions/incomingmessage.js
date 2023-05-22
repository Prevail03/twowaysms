const sql = require('mssql');
var Client = require('node-rest-client').Client;const validateId = require('../validateId');
const handleRegister = require('./handleRegister');
const handleDelete = require('./handleDelete');
const handleAccountCheck = require('./handleAccountCheck');
const handlePasswordReset = require('./handlePasswordReset');
const reset =require('../reset')

function handleIncomingMessage(textMessage, sender, textId, phoneNumber, config, sms, register, account, LinkID) {
    sql.connect(config, function(err, connection) {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database');

        const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND isActive = 1";
        const checkIfExistsRequest = new sql.Request(connection);
        checkIfExistsRequest.input('phoneNumber', sql.VarChar, phoneNumber);
        checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
            if (checkErr) {
                console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
                connection.close();
                return;
            }
            if (checkResults.recordset.length > 0) {
                // Existing user of two-way SMS
                console.log('Existing user of two-way SMS');
                // ... Handle existing user logic ...

            } else {
                // Does not exist in two_way_sms_tb
                const checkIfExistsQuerySysUsers = "SELECT TOP 1 * FROM sys_users_tb WHERE user_mobile = @phoneNumber OR user_phone = @phoneNumber";
                const checkIfExistsRequestSysUsers = new sql.Request(connection);
                checkIfExistsRequestSysUsers.input('phoneNumber', sql.VarChar, phoneNumber);
                checkIfExistsRequestSysUsers.query(checkIfExistsQuerySysUsers, function(checkErrSysUsers, checkResultsSysUsers) {
                    if (checkErrSysUsers) {
                        console.error('Error executing checkIfExistsQuerySysUsers: ' + checkErrSysUsers.stack);
                        connection.close();
                        return;
                    }
                    if (checkResultsSysUsers.recordset.length > 0) {
                        // Record exists in sys_users_tb
                        console.log('Record exists in sys_users_tb');
                        // ... Handle existing record logic ...

                    } else {
                        // Record does not exist in sys_users_tb
                        console.log('Start Registration Process');
                        // ... Handle registration process logic ...

                    }
                    connection.close();
                });
            }
        });
    });
}

module.exports = handleIncomingMessage;