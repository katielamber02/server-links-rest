exports.resetPasswordEmailParams = (email, token, name) => {
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
          Data: `<html><h1>Reset password link
                    </br>
                    Please you the following link in order to reset your password 
                    </h1 style="color:blue">
                    <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p></html>`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Reset Password Link',
      },
    },
  };
};
