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
exports.linkPublishedParams = (email, data) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
                      <html>
                          <h1>New link published | links-node-aws.com</h1>
                          <p>A new link titled <b>${
                            data.title
                          }</b> has been just publihsed in the following categories.</p>
                          
                          ${data.categories
                            .map((c) => {
                              return `
                                  <div>
                                      <h2>${c.name}</h2>
                                      <img src="${c.image.url}" alt="${c.name}" style="height:50px;" />
                                      <h3><a href="${process.env.CLIENT_URL}/links/${c.slug}">Check it out!</a></h3>
                                  </div>
                              `;
                            })
                            .join('-----------------------')}

                          <br />

                          <p>Do not wish to receive notifications?</p>
                          <p>Turn off notification by going to your <b>dashboard</b> > <b>update profile</b> and <b>uncheck the categories</b></p>
                          <p>${process.env.CLIENT_URL}/user/profile/update</p>

                      </html>
                  `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New link published',
      },
    },
  };
};
