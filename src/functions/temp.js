 const statusReg ="isRegistering";
                const request = new sql.Request(connection);
                const checkIfExistsQuery = "SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND status = @statusReg AND isActive = 1 order by time DESC ";
                request.input('phoneNumberEnd', sql.VarChar, phoneNumberEnd);
                request.input('statusReg', sql.VarChar, statusReg);
                request.query(checkIfExistsQuery, function(checkErr, checkResults) {
                    if (checkErr) {
                        console.error('Error executing checkIfExistsQuery: ' + checkErr.stack);
                        sql.close();
                        return;
                    }
                    if(checkResults.recordset.length > 0){
                        const fname = checkResults.recordset[0].firstname;
                        const lname = checkResults.recordset[0].lastname;
                        const national_ID = checkResults.recordset[0].national_ID;
                        const emailT =  checkResults.recordset[0].email;
                        const pass = checkResults.recordset[0].password;
                        const phone = sender;
                        var client = new Client({proxy: false});
                        var args = {
                            data: { firstname: fname, lastname: lname, ID: national_ID, email: emailT, password: pass, phonenumber: sender },
                            headers: { "Content-Type": "application/json" }
                        };
                        client.post("https://api.octagonafrica.com/v1/register", args, function (data, response) {
                        if ([200].includes(response.statusCode)) {
                            // success code
                            sms.send({
                                to: sender,
                                from:'24123',
                                message: "Congratulations!! "+user.firstname.toUpperCase() + " "+ user.lastname.toUpperCase() +". You have successfully registered with Octagon Africa.Incase of any queries contact support@octagonafrica.com' "
                            });
                            isRegistering = false;
                            registrationStep = 0;
                            user = {};
                            const statusSuccess = "FinishedisRegistering";
                            const phoneNumberSuccess = phoneNumber;
                            const messagingStepSuccess = "0";
                            const isActiveSuccess = 0;
                            sql.connect(config, function(err) {
                                const request = new sql.Request();
                                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusSuccess, messagingStep = @messagingStepSuccess WHERE phoneNumber = @phoneNumberSuccess AND time = (
                                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberSuccess )`;
                                request.input('statusSuccess', sql.VarChar, statusSuccess);
                                request.input('messagingStepSuccess', sql.VarChar, messagingStepSuccess);
                                request.input('phoneNumberSuccess', sql.VarChar, phoneNumberSuccess);
                                request.input('isActiveSuccess', sql.Bit, isActiveSuccess);
                                request.query(updateRegister1, function(err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('UPDATE successful');
                                sql.close();
                                });
                            });
                            console.log(response.statusCode)
                            
                        } else if ([201].includes(response.statusCode)) {
                            console.log(response.statusCode);
                            isRegistering = false;
                            registrationStep = 0;
                            user = {};
                        }else if ([400].includes(response.statusCode)) {
                            console.log(response.statusCode);
                            sms.send({
                                to: sender,
                                from:'24123',
                                message: "Registration unsuccesfull. Invalid Details or Username Exists . Please try again Later "    
                            });
                            isRegistering = false;
                            registrationStep = 0;
                            user = {};
                            const statusFailure400 = "FailedisRegistering";
                            const phoneNumberFailure400 = phoneNumber;
                            const messagingStepFailure400= "0";
                            const isActiveFailure400 = 0;
                            sql.connect(config, function(err) {
                                const request = new sql.Request();
                                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusFailure400, messagingStep = @messagingStepFailure400, isActive=@isActiveFailure400 WHERE phoneNumber = @phoneNumberFailure400 AND time = (
                                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberFailure400 )`;
                                request.input('statusFailure400', sql.VarChar, statusFailure400);
                                request.input('messagingStepFailure400', sql.VarChar, messagingStepFailure400);
                                request.input('phoneNumberFailure400', sql.VarChar, phoneNumberFailure400);
                                request.input('isActiveFailure400', sql.Bit, isActiveFailure400);
                                request.query(updateRegister1, function(err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('UPDATE successful');
                                sql.close();
                                });
                            });
                        }else if ([500].includes(response.statusCode)) {
                            console.log(response.statusCode);
                            sms.send({
                                to: sender,
                                from:'24123',
                                message: "Registration unsuccesfull. Internal Server Error. Please try again Later "    
                            });
                            isRegistering = false;
                            registrationStep = 0;
                            user = {};
                        }
                        else {
                            // error code
                            console.log(response.statusCode);
                        }
                    });  

                    }

                });