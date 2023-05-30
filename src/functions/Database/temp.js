console.log(response.statusCode);
sms.sendPremium(reset.error400(sender, LinkID));
sql.connect(config, function (err) {
  const request = new sql.Request();
  const statuserror404 = "ResetPasswordFailed";
  const messagingSteperror404 = "2";
  const phoneNumbererror404 = sender;
  const textIDATerror404 = textIDAT;
  const updateDelete = `UPDATE two_way_sms_tb SET status = @statuserror404, messagingStep = @messagingSteperror404  WHERE phoneNumber = @phoneNumbererror404 AND text_id_AT =@textIDATerror404 AND time = (
              SELECT MAX(time) FROM two_way_sms_tb WHERE phoneNumber = @phoneNumbererror404 )`;
  request.input('statuserror404', sql.VarChar, statuserror404);
  request.input('messagingSteperror404', sql.VarChar, messagingSteperror404);
  request.input('phoneNumbererror404', sql.NVarChar, phoneNumbererror404);
  request.input('textIDATerror404', sql.NVarChar, textIDATerror404);
  request.query(updateDelete, function (err, results) {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      return;
    }
    console.log(' Reset Password Attempt unsuccessful');
    sql.close();
  });
});