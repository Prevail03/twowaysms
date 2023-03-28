
sql.connect(config, function (err) {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');

  const request = new sql.Request();
  const statuserror500 = "FetchPeriodsIDFailed";
  const messagingSteperror500 = "0";
  const phoneNumbererror500 = sender;
  const textIDATerror500 = textIDAT;
  const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror500, messagingStep = @messagingSteperror500  WHERE phoneNumber = @phoneNumbererror500 AND text_id_AT =@textIDATerror500 AND time = (
                     SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumbererror500 )`;
  request.input('statuserror500', sql.VarChar, statuserror500);
  request.input('messagingSteperror500', sql.VarChar, messagingSteperror500);
  request.input('phoneNumbererror500', sql.NVarChar, phoneNumbererror500);
  request.input('textIDATerror500', sql.NVarChar, textIDATerror500);
  request.query(updateDelete, function (err, results) {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      return;
    }
    console.log(' FetchPeriodsID Attempt unsuccessful');
    sql.close();
  });
});
