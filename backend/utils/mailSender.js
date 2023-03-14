const nodemailer = require("nodemailer");


const mailSender =  async (reciever, subject, message, sender, reply_to) => {
    const transporter = nodemailer.createTransport( {
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    const options = {
        from: sender,
        to: reciever,
        replyTo: reply_to,
        subject: subject,
        html: message
    }

    transporter.sendMail(options, function(err, info){
        if(err){
            console.error(err);
        }
        console.log(info);
    })
}


module.exports = mailSender;