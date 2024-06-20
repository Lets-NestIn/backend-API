const AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const constant = require("../config/constant");
const pug = require("pug");

AWS.config.update({
  accessKeyId: constant.AWS_CREDENTIALS.ACCESS_KEY_ID,
  secretAccessKey: constant.AWS_CREDENTIALS.SECRET_ACCESS_KEY,
  region: constant.AWS_CREDENTIALS.REGION,
});

const sendMailToUser = async (to, subject, username, useremail, password) => {
  const ses = new AWS.SES();
  const compiledFunction = pug.compileFile("./views/mailTemplateUser.pug");
  const html = compiledFunction({
    username,
    useremail,
    password,
  });
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Data: html,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: constant.EMAIL_SENDER_SOURCENAME,
  };
  try {
    const result = await ses.sendEmail(params).promise();
    return result;
  } catch (e) {
    throw e;
  }
};

let sendForgetPasswordEmail = (userName, mail, url, token) => {
  try {
    const AWS_SES = new AWS.SES();
    const compiledFunction = pug.compileFile("./views/forgotPassword.pug");
    const html = compiledFunction({
      name: userName,
      resetLink: `${url}?token=${token}`,
    });

    let params = {
      Source: `${constant.EMAIL_SENDER_SOURCENAME}`,
      Destination: { ToAddresses: [mail] },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: `Reset your pasword`,
        },
      },
    };
    return AWS_SES.sendEmail(params).promise();
  } catch (e) {
    logger.error("sendForgetPasswordEmail::error", e);
    throw e;
  }
};

module.exports = {
  sendMailToUser,
  sendForgetPasswordEmail,
};
