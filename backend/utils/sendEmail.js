const nodemailer = require("nodemailer");

//i could have used .env file but somehow it doesn't seem to work

const sendEmail = async (options) => {

  const transporter = nodemailer.createTransport({
    
    service: "hotmail", //need respective service provider here
    host: "smtp.office365.com", //here it'll need host name of that service
    port: 587, //here the ports is mentioned
    auth: {
      user: "shoaibkhan188626@outlook.com", //who will send the mail
      pass: process.env.SMPT_PASSWORD || "gtx1050ti", //what will be the password of the sender's email
    },
  });

  const mailOptions = {
    from: "shoaibkhan188626@outlook.com", //as you can see here i have created the sender's name
    to: options.email, //who will receive the mail
    subject: options.subject, //what will be the subject of that mail
    text: options.message, //and what  will in the text
  };

  await transporter.sendMail(mailOptions); //here basically an await function
};

module.exports = sendEmail; //and finally exporting the function
