import sgMail from '@sendgrid/mail'

// Initialize the SendGrid Client
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("⚠️ SendGrid API Key missing. Email not sent.")
    return
  }

  const msg = {
    to,
    from: 'heer.gandhi23@spit.ac.in', // ⚠️ CHANGE THIS to your verified SendGrid email
    subject,
    html,
  }

  try {
    await sgMail.send(msg)
    console.log(`✅ Email sent to ${to}`)
  } catch (error: any) {
    console.error('❌ SendGrid Error:', error)
    if (error.response) {
      console.error(error.response.body)
    }
  }
}