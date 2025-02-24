

const nodemailer=require('nodemailer')

const sendMail=(otp,email)=>{
try {
    const transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL,
            pass: process.env.PASS
        }
    })

    const mailOptions={
        from:process.env.EMAIL,
        to:email,
        subject:"reset password otp",
        html:`<div>${otp}</div>`
    }

    transport.sendMail(mailOptions,(error,info)=>{
        if(error){
            throw new Error('failed to send email')
        }
    })
} catch (error) {
    console.log(error.message);
    
}
}

module.exports=sendMail