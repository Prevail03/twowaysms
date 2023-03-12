const config = {
    user: 'sa',
    password: '0ct@g0n2015?!',
    server: '35.246.5.59',
    database: 'MYDB',
    options: {
      encrypt: false,
      trustServerCertificate: true,
    }
  };
  module.exports = config;
//   CREATE TABLE two_way_sms_tb (
//     text_ID INT IDENTITY(1,1) PRIMARY KEY,
//     text NVARCHAR(MAX),
//     text_id_AT NVARCHAR(50),
//     phoneNumber NVARCHAR(20),
//     status NVARCHAR(50),
//     messagingStep INT,
//     isActive BIT,
//     time DATETIME
// );
// INSERT INTO two_way_sms_tb (text, text_id_AT, phoneNumber, status, messagingStep, isActive, time)
// VALUES ('Hello World', '123456789', '+254712345678', 'sent', 1, 1, GETDATE());

