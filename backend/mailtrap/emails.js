import { mailtrapClient } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE  } from "./emailTemplates.js";

 export const sendVerificationEmail = async (sendVerificationEmail, verivicationToken) => {
    const recipient = [{email}]

    try {
        const response =await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification Email`,error);
        throw new Error(`Error sending verification email: ${error}`);
        
    }
 };