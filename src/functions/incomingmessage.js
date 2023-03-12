const sql = require('mssql');
// const config = require('/var/www/twowaysms/dbconnect.js');
function handleIncomingMessage(text, sender, textId, phoneNumber, time, config, sms) {
    // Check if user exists in database
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
            sql.close();
            return;
        }
        if (checkResults.recordset.length > 0) {
            console.log('User already exists');
            const status = checkResults.recordset[0].status;
            const messagingStep = checkResults.recordset[0].messagingStep;
            switch (status) {
            case 'isRegistering':
                handleRegister(text, sender, messagingStep);
                break;
            case 'isDeleting':
                handleDelete(text, sender, messagingStep);
                break;
            case 'isCheckingAccount':
                handleAccountCheck(text, sender, messagingStep);
                break;
            case 'ResetingPassword':
                handlePasswordReset(text, sender, messagingStep);
                break;
            default:
                console.log('Unknown status: ' + status);
                break;
            }
        } else {
            //new user in the system
            const insertQuery = "INSERT INTO two_way_sms_tb (text, text_id_AT, phoneNumber, isActive, time) VALUES (@text, @text_id_AT, @phoneNumber, @isActive, @time)";
    
            const insertRequest = new sql.Request(connection);
            insertRequest.input('text', sql.VarChar, text);
            insertRequest.input('text_id_AT', sql.VarChar, textId);
            insertRequest.input('phoneNumber', sql.VarChar, phoneNumber);
            insertRequest.input('isActive', sql.Bit, 1);
            insertRequest.input('time', sql.DateTime2, time);
            insertRequest.query(insertQuery, function(insertErr, insertResults) {
            if (insertErr) {
                console.error('Error executing insertQuery: ' + insertErr.stack);
                sql.close();
                return;
            }
            console.log('INSERT successful');
                switch (text.toLowerCase()) {
                    // case '':
                    case 'register':
                        //reset isRegistering flag and registrationStep
                        isRegistering = false;
                        registrationStep = 0;
                        sms.send(register.newCustomer(sender));
                        sms.send(register.enterId(sender));
                        //set a flag to indicate that the user is in the process of registering
                        isRegistering = true;         
                        //request for ID number
                        registrationStep = 2;
                        const status = "isRegistering";
                        const phoneNumber = sender;
                        const messagingStep= "2";
                        sql.connect(config, function(err) {
                            const request = new sql.Request();
                            const updateRegister1 = `UPDATE two_way_sms_tb SET status = @status, messagingStep = @messagingStep WHERE phoneNumber = @phoneNumber AND time = (
                                SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber )`;
                            request.input('status', sql.VarChar, status);
                            request.input('messagingStep', sql.VarChar, messagingStep);
                            request.input('phoneNumber', sql.VarChar, phoneNumber);
                            request.query(updateRegister1, function(err, results) {
                            if (err) {
                                console.error('Error executing query: ' + err.stack);
                                return;
                            }
                            console.log('UPDATE successful');
                            sql.close();
                            });
                        });
                        break;
                        ///other Cases
                        case 'balance':
                        messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - balance ';
                        sms.send({
                            to: sender,
                            from:'20880',
                            message: messageToCustomer
                        });
                        break;
                        case 'accounts':
                            isCheckingAccount=false;
                            accountStep=0;
                            sms.send(account.welcomeMessageAccount(sender));
                            sms.send(account.provideUserName(sender));
                            isCheckingAccount=true;
                            accountStep=2;
                            const statusAccounts = "isCheckingAccounts";
                            const phoneNumberAccounts = sender;
                            const messagingStepAccounts= "2";
                            sql.connect(config, function(err) {
                                const request = new sql.Request();
                                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusAccounts, messagingStep = @messagingStepAccounts WHERE phoneNumber = @phoneNumberAccounts AND time = (
                                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberAccounts )`;
                                request.input('status', sql.VarChar, statusAccounts);
                                request.input('messagingStep', sql.VarChar, messagingStepAccounts);
                                request.input('phoneNumber', sql.VarChar, phoneNumberAccounts);
                                request.query(updateRegister1, function(err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('UPDATE successful');
                                sql.close();
                                });
                            });
                            break;
                        case 'rate':
                            messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services. Enter your 4 digit pin - rate';
                            sms.send({
                                to: sender,
                                from:'20880',
                                message: messageToCustomer
                            });
                            
                            break;
                        case 'delete':
                            isDeleting=false;
                            deletingStep=0;
                            messageToCustomer = 'Hello Our Dear Esteemed Customer, Welcome to Octagon Services.';
                            
                            sms.send({
                                to: sender,
                                from:'20880',
                                message: messageToCustomer
                            });
                        
                            sms.send(register.enterId(sender));
                            isDeleting =true;
                            deletingStep=2;
                            const statusDeleting = "isDeleting";
                            const phoneNumberDeleting = sender;
                            const messagingStepDeleting= "2";
                            sql.connect(config, function(err) {
                                const request = new sql.Request();
                                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusDeleting, messagingStep = @messagingStepDeleting WHERE phoneNumber = @phonNumberDeleting AND time = (
                                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberDeleting )`;
                                request.input('status', sql.VarChar, statusDeleting);
                                request.input('messagingStep', sql.VarChar, messagingStepDeleting);
                                request.input('phoneNumber', sql.VarChar, phoneNumberDeleting);
                                request.query(updateRegister1, function(err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('UPDATE successful');
                                sql.close();
                                });
                            });
                            break;
                        case 'reset':
                            ResetingPassword=false;
                            resetStep=0;
                            sms.send(reset.welcomeMessage(sender));
                            sms.send(reset.enterEmail(sender));
                            ResetingPassword=true;
                            resetStep=2;
                            const statusReset = "isCheckingAccounts";
                            const phoneNumberReset = sender;
                            const messagingStepReset= "2";
                            sql.connect(config, function(err) {
                                const request = new sql.Request();
                                const updateRegister1 = `UPDATE two_way_sms_tb SET status = @statusReset, messagingStep = @messagingStepReset WHERE phoneNumber = @phoneNumberReset AND time = (
                                    SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberReset )`;
                                request.input('status', sql.VarChar, statusReset);
                                request.input('messagingStep', sql.VarChar, messagingStepReset);
                                request.input('phoneNumber', sql.VarChar, phoneNumberReset);
                                request.query(updateRegister1, function(err, results) {
                                if (err) {
                                    console.error('Error executing query: ' + err.stack);
                                    return;
                                }
                                console.log('UPDATE successful');
                                sql.close();
                                });
                            });
                            break;
                        
                    default:
                        messageToCustomer = 'Welcome To Octagon Africa you can access our services by sending the word register,save, balance,statement,products';
                        sms.send({
                            to: sender,
                            from:'20880',
                            message: messageToCustomer
                        });
                    break;
                }
            });
        }
        });
    });
}
module.exports = handleIncomingMessage;