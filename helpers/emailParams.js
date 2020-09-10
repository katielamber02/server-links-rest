exports.emailParams = (email, token, name) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: `<html><h1>Hello, ${name}
                  </br>
                  Verify your email with the following link:  
                  </h1 style="color:blue">
                  <p>${process.env.CLIENT_URL}/auth/activate/${token}</p></html>`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Complete registration',
      },
    },
  };
};
