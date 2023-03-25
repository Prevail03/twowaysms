const nameFromAPI = statementsData.name;
const emailFromAPI = statementsData.user_email;
const periodsNameAPI = statementsData.period_name;
const phoneNumberStatement = sender;
const textIDATStatement = textIDAT;
sql.connect(config, function (err) {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');

  const request = new sql.Request();
  const updateAccounts = `UPDATE two_way_sms_tb SET status = 'isCheckingAccountSuccess', messagingStep= '0', periodname = @periodsNameAPI, name = @nameFromAPI, email = @emailFromAPI  WHERE phoneNumber = @phoneNumberStatement AND text_id_AT = @textIDATperiodName AND time = (SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberStatement)`;
  request.input('phoneNumberStatement', sql.NVarChar, phoneNumberStatement);
  request.input('periodsNameAPI', sql.NVarChar, periodsNameAPI);
  request.input('emailFromAPI', sql.NVarChar, emailFromAPI);
  request.input('nameFromAPI', sql.NVarChar, nameFromAPI);
  request.input('textIDATStatement', sql.NVarChar, textIDATStatement);
  request.query(updateAccounts, function (err, results) {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      sql.close();
      return;
    }
    console.log('Member Statement details UPDATE successful');
    const statusMemberStatement = "isCheckingAccountSuccess";
    const phoneNumberStatement = sender;
    const textIDATMemberStatement = textIDAT;
    // Bind the values to the parameters
    const request = new sql.Request();
    request.input('statusMemberStatement', sql.NVarChar(50), statusMemberStatement);
    request.input('phoneNumberStatement', sql.NVarChar(50), phoneNumberStatement);
    request.input('textIDATMemberStatement', sql.NVarChar(50), textIDATMemberStatement);
    request.query("SELECT TOP 1 * FROM two_way_sms_tb WHERE phoneNumber = @phoneNumberStatement AND status = @statusMemberStatement AND isActive = 1 AND text_id_AT = @textIDATMemberStatement order by time DESC", function (err, memberStatementResults) {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
      }

      if (memberStatementResults.recordset.length > 0) {
        const name = memberStatementResults.recordset[0].name;
        const email = memberStatementResults.recordset[0].email;
        const periodsName = memberStatementResults.recordset[0].periodname;
        sms.send({
          to: sender,
          from: '20880',
          message: "Dear " + name + ".\n Your member statement for " + periodsName + " period has been sent to  " + email
        });

      }

      sql.close();
    });
  });
});