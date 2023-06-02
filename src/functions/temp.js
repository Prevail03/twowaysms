sql.connect(config, function(err, connection) {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
    const checkIfExistsQuery = "SELECT TOP 1 * FROM sys_users_tb WHERE user_email = @textEmail";
    const checkIfExistsRequest = new sql.Request(connection);
    checkIfExistsRequest.input('textEmail', sql.VarChar, textEmail);
    checkIfExistsRequest.query(checkIfExistsQuery, function(checkErr, checkResults) {
        if (checkErr) {
        console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
        connection.close();
        return;
        }
        if (checkResults.recordset.length > 0) {
            console.log("Existing user. Login");
            sms.sendPremium(register.menuMessage(sender, LinkID));
                // ... Handle existing record logic ..
                const status="existingCustomer";
                const messagingStep = "0";
                const phoneNumber = sender;
                const isActive = 0;
                const request = new sql.Request();
                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @status, isActive=@isActive, messagingStep = @messagingStep WHERE phoneNumber = @phoneNumber AND time = (
                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber )`;
                request.input('status', sql.VarChar, status);
                request.input('messagingStep', sql.VarChar, messagingStep);
                request.input('phoneNumber', sql.VarChar, phoneNumber);
                request.input('isActive', sql.Bit, isActive);
                request.query(updateRegister1, function (err, results) {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return;
                }
                console.log('Menu Sent');
                });
        }else{
           sms.sendPremium(register.enterPassword(sender,LinkID));    
           updateEmail(statusPassword,phoneNumberPassword,messagingStepPassword,textEmail,textIDATPass,config);
        }

        });

});