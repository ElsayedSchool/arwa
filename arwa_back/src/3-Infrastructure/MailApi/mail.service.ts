import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
@Injectable()
export class MailService {
  private transporter;
  constructor(private configSer: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configSer.get("MAIL_HOST"),
      port: parseInt(this.configSer.get("MAIL_PORT")), // SMTP port (usually 587 for TLS)
      secure: true, //this.configSer.get('MAIL_IS_SECURE') === 'true', // true for 465, false for other ports
      auth: {
        user: this.configSer.get("MAIL_EMAIL"),
        pass: this.configSer.get("MAIL_PASSWORD"),
      },
      tls: {
        rejectUnauthorized: false,
      },
      greetingTimeout: 5000,
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    resetCode = 12345678
  ) {
    const mailOptions = {
      from: this.configSer.get("MAIL_EMAIL"),
      to,
      subject,
      text,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
              /* Add your email styles here */
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
                  text-align:center;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              p {
                  color: #555;
              }
              .code {
                  font-size: 24px;
                  color: #007bff;
                  margin-top: 10px;
              }
              .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .logo {
                max-width: 100%;
                height: auto;
            }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Verify Email</h2>
              <p>Hello Sir,</p>
              <p>You have requested to verify your email. To complete the verification, please use the following verification code:</p>
              <p class="code">[${resetCode}]</p>
              <p>If you did not request a Verify Email, please ignore this email. This code will expire after 15 minutes.</p>
              <p>Thank you for using our service!</p>
          </div>
      </body>
      </html>
      `,
    };

    await this.sendAsync(mailOptions, "sendMail");
  }

  async sendComplainEmail(subject: string, text: string) {
    const mailOptions = {
      from: this.configSer.get("MAIL_EMAIL"),
      to: this.configSer.get("MAIL_EMAIL"),
      subject,
      text,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello Sir,</title>
          <style>
              /* Add your email styles here */
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
                  text-align:center;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              p {
                  color: #555;
              }
              .code {
                  font-size: 24px;
                  color: #007bff;
                  margin-top: 10px;
              }
              .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .logo {
                max-width: 100%;
                height: auto;
            }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>
              Complains</h2>
              
              <p>${text}</p>
          </div>
      </body>
      </html>
      `,
    };

    await this.sendAsync(mailOptions, "sendMail");
  }

  async sendTransactionEmail(
    to: string,
    subject: string,
    text: string,
    transactionId: string,
    CoinsPrice: number,
    coinsNumber: number
  ) {
    const mailOptions = {
      from: this.configSer.get("MAIL_EMAIL"),
      to,
      subject,
      text,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
              /* Add your email styles here */
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
                  text-align:center;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              p {
                  color: #555;
              }
              .code {
                  font-size: 24px;
                  color: #007bff;
                  margin-top: 10px;
              }
              .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .logo {
                max-width: 100%;
                height: auto;
            }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>
              Your order’s been processed ${
                true
                  ? "Successfully"
                  : "but still pending we will check it to find the problem"
              }</h2>
              <p>Transaction Date : ${new Date().toDateString()}</p>
              <p>Transaction Number : ${transactionId}</p>
              <p>Coin Offer Price : ${CoinsPrice} $</p>
              <p>Payment Gateway : Payment***</p>
              <p>Add Coins to your Account : ${coinsNumber}</p>
              <p>Thank you for using our service!</p>
          </div>
      </body>
      </html>
      `,
    };

    await this.sendAsync(mailOptions, "sendTransactionEmail");
  }

  async sendResetEmail(
    to: string,
    subject: string,
    tokenLink: string,
    text = ""
  ) {
    const mailOptions = {
      from: this.configSer.get("MAIL_EMAIL"),
      to,
      subject,
      text,
      html: `<!DOCTYPE html>
    <html>
    <head>
        <title>Password Reset Email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color:white;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 2px 5px #ccc;
            }
            h2 {
                color: #007BFF;
            }
            p {
                font-size: 16px;
            }
            a {
                display: inline-block;
                background-color: #007BFF;
                color: #fff;
                text-align: center;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Password Reset</h2>
            <p>Hello Sir,</p>
            <p>You have requested to reset your password for email <span style="background-color: #FFFFFF;text-decoration:none">${to}</span>.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${tokenLink}">Reset Password</a>
            <p> Change Password Link will will be Expired After one hour</p> 
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>Thank you for using FEL SPORT APP!</p>
        </div>
    </body>
    </html>
    `,
    };

    await this.sendAsync(mailOptions, "sendResetEmail");
  }

  async sendRemoveAccountByEmail(
    to: string,
    subject: string,
    tokenLink: string,
    text = ""
  ) {
    const mailOptions = {
      from: this.configSer.get("MAIL_EMAIL"),
      to,
      subject,
      text,
      html: `<!DOCTYPE html>
    <html>
    <head>
        <title>Password Reset Email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color:white;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0 2px 5px #ccc;
            }
            h2 {
                color: #007BFF;
            }
            p {
                font-size: 16px;
            }
            a {
                display: inline-block;
                background-color: red;
                color: #fff;
                text-align: center;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Remove Account At FEL League APP</h2>
            <p>Hello Sir,</p>
            <p>You have requested to Remove Your Account for email <span style="background-color: #FFFFFF;text-decoration:none">${to}</span>.</p>
            <p>Click the button below to Remove Your Account:</p>
            <a href="${tokenLink}">Confirm Remove Acccount</a>
            <p> Change Password Link will will be Expired After one hour</p> 
            <p>If you didn't request this Remove Account At FEL League APP, please ignore this email. Your password will remain unchanged.</p>
            <p>Thank you for using FEL SPORT APP!</p>
        </div>
    </body>
    </html>
    `,
    };

    await this.sendAsync(mailOptions, "sendRemoveAccountByEmail");
  }

  async sendAsync(mailOptions: any, context = "") {
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Error sending email(${context}):`, error);
    }
  }
}
