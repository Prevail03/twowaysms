app.post("/webhook", (req, res) => {
    const payload = req.body;
    console.log(payload);
    const sender = payload.from;
    const textId =payload.id;
    const phoneNumber=sender;
    const isActive=1;
    console.log(sender);
    const textMessage = payload.text;
    console.log(textMessage);
    const sms = AfricasTalking.SMS;
    let messageToCustomer;
  
    // Retrieve user status and messaging step
    sql.connect(config, function(err, connection) {
      if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
      }
      console.log('Connected to database');
  
      const getStatusQuery = "SELECT TOP 1 status, messagingStep FROM two_way_sms_tb WHERE phoneNumber = @phoneNumber AND isActive = 1 ORDER BY time DESC";
      const getStatusRequest = new sql.Request(connection);
      getStatusRequest.input('phoneNumber', sql.VarChar, phoneNumber);
      getStatusRequest.query(getStatusQuery, function(statusErr, statusResults) {
        if (statusErr) {
          console.error('Error executing getStatusQuery: ' + statusErr.stack);
          sql.close();
          return;
        }
  
        let status = statusResults.recordset[0].status;
        let messagingStep = statusResults.recordset[0].messagingStep;
  
        switch (status) {
          case 'isRegistering':
            // Registration code block
            switch (messagingStep) {
              case '1':
                // Do something
                break;
              case '2':
                // Do something else
                break;
              // Other messaging steps
            }
            break;
          case 'isDeleting':
            // Deleting code block
            break;
          case 'isCheckingAccount':
            // Checking account code block
            break;
          case 'isResettingPassword':
            // Resetting password code block
            break;
          default:
            // Handle other cases
        }
  
        sql.close();
      });
    });
  });
  