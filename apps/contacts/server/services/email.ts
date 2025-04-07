import nodemailer from "nodemailer";
import { log } from "../vite";
import sgMail from "@sendgrid/mail";
import { storage } from "../storage";

// Interface for email options
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Define email service type
type EmailServiceType = "sendgrid" | "smtp" | "test";

// Check environment variables for email configuration
function getEmailConfig(): {
  serviceType: EmailServiceType;
  from: string;
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
} {
  // Check for SendGrid API key first
  if (process.env.SENDGRID_API_KEY) {
    log("Using SendGrid for email delivery", "email");
    return {
      serviceType: "sendgrid",
      from: process.env.EMAIL_FROM || "no-reply@contactmanager.boltfoundry.com",
    };
  }

  // Next check for SMTP configuration
  if (
    process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS
  ) {
    log("Using SMTP for email delivery", "email");
    return {
      serviceType: "smtp",
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
      secure: process.env.EMAIL_SECURE === "true",
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
      from: process.env.EMAIL_FROM || "no-reply@contactmanager.boltfoundry.com",
    };
  }

  // Default to test account if no other configuration is available
  log(
    "Using test email account - emails will be logged to console only",
    "email",
  );
  return {
    serviceType: "test",
    from: '"Contact Manager" <no-reply@contactmanager.boltfoundry.com>',
  };
}

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;
let emailServiceType: EmailServiceType = "test";
let fromEmail: string = '"Bolt Foundry CMS" <no-reply@cms.boltfoundry.com>';

// Initialize email service
export async function initEmailService() {
  console.log("============= INITIALIZING EMAIL SERVICE =============");

  // Log all environment variables related to email configuration to help with debugging
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "not set");
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT || "not set");
  console.log(
    "EMAIL_USER:",
    process.env.EMAIL_USER ? "****set****" : "not set",
  );
  console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASS ? "****set****" : "not set",
  );
  console.log("EMAIL_FROM:", process.env.EMAIL_FROM || "not set");
  console.log(
    "SENDGRID_API_KEY:",
    process.env.SENDGRID_API_KEY ? "****set****" : "not set",
  );
  console.log("NODE_ENV:", process.env.NODE_ENV || "not set");
  console.log("REPLIT_DOMAINS:", process.env.REPLIT_DOMAINS || "not set");

  const emailConfig = getEmailConfig();
  emailServiceType = emailConfig.serviceType;
  fromEmail = emailConfig.from;

  console.log(`Selected email service type: ${emailServiceType}`);
  console.log(`From email address: ${fromEmail}`);

  try {
    if (emailConfig.serviceType === "sendgrid") {
      // Initialize SendGrid
      console.log("Initializing SendGrid email service...");
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
      console.log("SendGrid API key configured successfully");
      log("SendGrid email service initialized", "email");
      return;
    }

    if (emailConfig.serviceType === "smtp") {
      // Initialize SMTP
      console.log("Initializing SMTP email service...");

      // For Gmail, we need to set some specific options to make it work reliably
      const isGmail = emailConfig.host?.includes("gmail.com");

      if (isGmail) {
        console.log("Gmail SMTP detected, configuring with special settings");
      }

      const config = {
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.port === 465, // true for 465, false for other ports like 587
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass,
        },
        // Special settings for Gmail
        ...(isGmail && {
          tls: {
            rejectUnauthorized: false,
          },
        }),
      };

      console.log("SMTP Configuration:", {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.auth.user?.substring(0, 3) + "***",
        tls: config.tls ? "configured" : "not configured",
      });

      transporter = nodemailer.createTransport(config);

      // Verify the connection
      transporter.verify((error, success) => {
        if (error) {
          console.error("SMTP connection verification error:", error.message);
          log(`SMTP connection error: ${error.message}`, "email");
        } else {
          console.log("SMTP connection verified successfully");
          log("SMTP server is ready to take our messages", "email");
        }
      });

      log(
        `SMTP email service initialized (${
          isGmail ? "Gmail" : "Generic SMTP"
        })`,
        "email",
      );
      return;
    }

    // If no production email service is configured, create a test account
    console.log(
      "No production email service configured, creating test account...",
    );
    const testAccount = await nodemailer.createTestAccount();

    console.log("Test account created:", testAccount.user);

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    log(`Test email account created: ${testAccount.user}`, "email");
  } catch (error) {
    console.error("Failed to initialize email service:", error);
    log(`Failed to initialize email service: ${error}`, "email");

    // Fallback to test mode
    emailServiceType = "test";
    transporter = null;

    // Try to create a test account as a last resort
    try {
      console.log("Attempting to create fallback test email account...");
      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log("Fallback test email account created successfully");
    } catch (testError) {
      console.error("Failed to create fallback test account:", testError);
    }
  }

  console.log(
    "============= EMAIL SERVICE INITIALIZATION COMPLETE =============",
  );
}

// Send email function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  console.log(
    `[EMAIL] Sending email to ${options.to} with subject: ${options.subject}`,
  );

  // Ensure service is initialized
  if (!transporter || emailServiceType === "test") {
    console.log(
      "[EMAIL] Email service not initialized or using test mode, initializing...",
    );
    await initEmailService();
    if (!transporter) {
      console.error("[EMAIL] Failed to initialize email service");
      logEmailContent("SERVICE UNAVAILABLE", options);
      return false;
    }
  }

  // Log email service configuration
  console.log(`[EMAIL] Using email service type: ${emailServiceType}`);
  console.log(`[EMAIL] From email address: ${fromEmail}`);

  try {
    if (emailServiceType === "sendgrid") {
      // Send via SendGrid
      console.log("[EMAIL] Attempting to send via SendGrid...");
      await sgMail.send({
        to: options.to,
        from: fromEmail,
        subject: options.subject,
        text: options.text || "",
        html: options.html,
      });

      console.log(
        `[EMAIL] Successfully sent email to ${options.to} via SendGrid`,
      );
      log(`Email sent to ${options.to} via SendGrid`, "email");
      return true;
    }

    if (emailServiceType === "smtp" && transporter) {
      // Send via SMTP
      console.log(`[EMAIL] Attempting to send via SMTP to ${options.to}...`);

      const mailOptions = {
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text || "",
        html: options.html,
      };

      console.log(`[EMAIL] Mail options: ${
        JSON.stringify({
          from: fromEmail,
          to: options.to,
          subject: options.subject,
        })
      }`);

      const info = await transporter.sendMail(mailOptions);

      console.log(
        `[EMAIL] Email sent successfully. MessageId: ${info.messageId}`,
      );
      console.log(`[EMAIL] SMTP response: ${JSON.stringify(info.response)}`);

      log(`Email sent to ${options.to}: ${info.messageId}`, "email");
      log(`SMTP response: ${JSON.stringify(info.response)}`, "email");
      logEmailSuccess(options, info);
      return true;
    }

    // Send via test account
    if (transporter) {
      console.log("[EMAIL] Attempting to send via test account...");
      const info = await transporter.sendMail({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text || "",
        html: options.html,
      });

      // Log the Ethereal URL where the email can be viewed
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[EMAIL] Test email sent. Preview URL: ${previewUrl}`);
      log(`Email preview URL: ${previewUrl}`, "email");
      logEmailSuccess(options, info);
      return true;
    }

    // If we got here, something is wrong with the configuration
    console.error("[EMAIL] No valid email transport configuration found");
    logEmailContent("SERVICE UNAVAILABLE", options);
    return false;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error && error.stack
      ? error.stack
      : "No stack trace";

    console.error(`[EMAIL] Failed to send email to ${options.to}`);
    console.error(`[EMAIL] Error message: ${errorMessage}`);
    console.error(`[EMAIL] Error stack: ${errorStack}`);

    log(`Failed to send email to ${options.to}: ${errorMessage}`, "email");
    log(`Error details: ${errorStack}`, "email");
    logEmailFailure(options, errorMessage);

    // Special handling for Gmail-specific errors
    if (emailServiceType === "smtp" && typeof errorMessage === "string") {
      if (
        errorMessage.includes("Invalid login") ||
        errorMessage.includes("Username and Password not accepted")
      ) {
        console.error(
          "[EMAIL] Gmail authentication failed. Check your EMAIL_USER and EMAIL_PASS credentials.",
        );
        console.error(
          "[EMAIL] For Gmail, you may need to use an App Password if 2FA is enabled.",
        );
        log(
          "Gmail authentication failed. Check your EMAIL_USER and EMAIL_PASS credentials.",
          "email",
        );
        log(
          "For Gmail, you may need to use an App Password if 2FA is enabled.",
          "email",
        );
      } else if (
        errorMessage.includes("security") ||
        errorMessage.includes("less secure")
      ) {
        console.error(
          "[EMAIL] Gmail security settings may be blocking the connection.",
        );
        console.error(
          '[EMAIL] Enable "Less secure app access" or use an App Password.',
        );
        log("Gmail security settings may be blocking the connection.", "email");
        log('Enable "Less secure app access" or use an App Password.', "email");
      }
    }

    return false;
  }
}

// Helper function to log email content for debugging
function logEmailContent(status: string, options: EmailOptions) {
  console.log(`
  ============= EMAIL ${status} =============
  To: ${options.to}
  Subject: ${options.subject}
  
  ${options.text || options.html}
  ============================================================
  `);
}

// Helper function to log successful email
function logEmailSuccess(options: EmailOptions, info: any) {
  console.log(`
  ============= EMAIL SENT SUCCESSFULLY =============
  To: ${options.to}
  Subject: ${options.subject}
  Message ID: ${info.messageId}
  Preview URL: ${nodemailer.getTestMessageUrl?.(info) || "N/A"}
  ============================================================
  `);
}

// Helper function to log failed email
function logEmailFailure(options: EmailOptions, error: any) {
  console.log(`
  ============= EMAIL FAILED TO SEND =============
  To: ${options.to}
  Subject: ${options.subject}
  Error: ${error}
  
  ${options.text || options.html}
  ============================================================
  `);
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string,
): Promise<boolean> {
  // Determine the base URL for verification links
  let baseUrl = "http://localhost:5000";

  // First try Replit domain for production
  if (process.env.REPLIT_DOMAINS) {
    baseUrl = `https://${process.env.REPLIT_DOMAINS}`;
    log(`Using Replit domain for verification emails: ${baseUrl}`, "email");
  } // Then try custom domain if specified
  else if (process.env.PUBLIC_URL) {
    baseUrl = process.env.PUBLIC_URL;
    log(`Using custom domain for verification emails: ${baseUrl}`, "email");
  }

  // Log the environment and domain details to help with debugging
  log(`Environment details:`, "email");
  log(`- NODE_ENV: ${process.env.NODE_ENV || "not set"}`, "email");
  log(`- REPLIT_DOMAINS: ${process.env.REPLIT_DOMAINS || "not set"}`, "email");
  log(`- PUBLIC_URL: ${process.env.PUBLIC_URL || "not set"}`, "email");
  log(`- Using base URL: ${baseUrl}`, "email");

  const verificationUrl = `${baseUrl}/api/verify?token=${token}`;

  const subject = "Verify your Bolt Foundry CMS account";

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">Bolt Foundry CMS</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
      <h2>Verify Your Email</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering for a Bolt Foundry CMS account. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
      </div>
      <p>Or copy and paste this URL into your browser:</p>
      <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, you can safely ignore this email.</p>
      <p>Best regards,<br>Bolt Foundry CMS Team</p>
    </div>
    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
      &copy; ${new Date().getFullYear()} BoltFoundry. All rights reserved.
    </div>
  </div>
  `;

  const textContent = `
  Hello ${name},
  
  Thank you for registering for a Bolt Foundry CMS account. Please verify your email address by clicking the link below:
  
  ${verificationUrl}
  
  This link will expire in 24 hours.
  
  If you did not create an account, you can safely ignore this email.
  
  Best regards,
  Bolt Foundry CMS Team
  `;

  return sendEmail({
    to: email,
    subject,
    html: htmlContent,
    text: textContent,
  });
}

// Database access for email settings

/**
 * Function to enable or disable the waitlist welcome email
 * @param {boolean} enabled - Whether to enable the welcome email
 */
export async function setWaitlistEmailEnabled(enabled: boolean): Promise<void> {
  try {
    // Get current settings or create default
    const settings = await storage.getEmailSettings();

    if (settings) {
      await storage.createOrUpdateEmailSettings({ enabled });
    } else {
      // Create default settings with the provided enabled state
      await storage.createOrUpdateEmailSettings({ enabled });
    }
    log(`Waitlist welcome emails ${enabled ? "enabled" : "disabled"}`, "email");
  } catch (error) {
    console.error("Failed to update email enabled status:", error);
    log(`Failed to update email enabled status: ${error}`, "email");
  }
}

/**
 * Function to check if waitlist welcome emails are enabled
 * @returns {boolean} Whether waitlist welcome emails are enabled
 */
export async function isWaitlistEmailEnabled(): Promise<boolean> {
  try {
    const settings = await storage.getEmailSettings();
    return settings?.enabled ?? true; // Default to true if no settings exist
  } catch (error) {
    console.error("Failed to check if emails are enabled:", error);
    log(`Failed to check if emails are enabled: ${error}`, "email");
    return true; // Default to true on error
  }
}

/**
 * Function to update the waitlist email template
 * @param {object} options - The email template options
 * @returns {boolean} Whether the update was successful
 */
export async function updateWaitlistEmailTemplate(options: {
  subject?: string;
  textContent?: string;
}): Promise<boolean> {
  try {
    // Get current settings
    const settings = await storage.getEmailSettings();

    // For plain text emails, we'll use a simple pre tag to preserve formatting
    // when showing the plain text in HTML context
    const htmlContent = options.textContent
      ? `<pre style="font-family: monospace;">${options.textContent}</pre>`
      : undefined;

    if (settings) {
      // Update existing settings
      await storage.createOrUpdateEmailSettings({
        subject: options.subject,
        textContent: options.textContent,
        htmlContent,
      });
    } else {
      // Create with defaults and override with any provided values
      const defaultSubject = "⚡️ Welcome to Bolt Foundry ⚡️";
      const defaultTextContent = `Hey {{name}} 👋 

Thanks for joining the Bolt Foundry waitlist! We're excited to bring you on this fine-tuning adventure with us. 

We'll let you know as soon as we open the platform. In the meantime, reach out anytime if you have questions or want to talk. 

You can reply to this email and I'll respond. 

Thanks! 

Dan Sisco
Co-Founder, Bolt Foundry`;

      await storage.createOrUpdateEmailSettings({
        subject: options.subject || defaultSubject,
        textContent: options.textContent || defaultTextContent,
        htmlContent: htmlContent ||
          `<pre style="font-family: monospace;">${defaultTextContent}</pre>`,
      });
    }

    log("Waitlist email template updated successfully", "email");
    return true;
  } catch (error) {
    console.error("Failed to update waitlist email template:", error);
    log(`Failed to update waitlist email template: ${error}`, "email");
    return false;
  }
}

/**
 * Function to get the current waitlist email template
 * @returns {object} The current waitlist email template
 */
export async function getWaitlistEmailTemplate(): Promise<{
  subject: string;
  htmlContent: string;
  textContent: string;
  isEnabled: boolean;
}> {
  try {
    // Get current settings or create default
    let settings = await storage.getEmailSettings();

    if (!settings) {
      // Create default settings if none exist
      const defaultSubject = "⚡️ Welcome to Bolt Foundry ⚡️";
      const defaultTextContent = `Hey {{name}} 👋 

Thanks for joining the Bolt Foundry waitlist! We're excited to bring you on this fine-tuning adventure with us. 

We'll let you know as soon as we open the platform. In the meantime, reach out anytime if you have questions or want to talk. 

You can reply to this email and I'll respond. 

Thanks! 

Dan Sisco
Co-Founder, Bolt Foundry`;

      const defaultHtmlContent =
        `<pre style="font-family: monospace;">${defaultTextContent}</pre>`;

      settings = await storage.createOrUpdateEmailSettings({
        enabled: true,
        subject: defaultSubject,
        textContent: defaultTextContent,
        htmlContent: defaultHtmlContent,
      });
    }

    return {
      subject: settings.subject,
      htmlContent: settings.htmlContent,
      textContent: settings.textContent,
      isEnabled: settings.enabled,
    };
  } catch (error) {
    console.error("Failed to get email template:", error);
    log(`Failed to get email template: ${error}`, "email");

    // Return default values if there's an error
    return {
      subject: "⚡️ Welcome to Bolt Foundry ⚡️",
      htmlContent:
        '<pre style="font-family: monospace;">Default email content</pre>',
      textContent: "Default email content",
      isEnabled: true,
    };
  }
}

/**
 * Send a welcome email to someone who joined the waitlist
 * @param {string} email - The recipient's email address
 * @param {string} name - The recipient's name
 * @returns {Promise<boolean>} Whether the email was sent successfully
 */
export async function sendWaitlistWelcomeEmail(
  email: string,
  name: string,
): Promise<boolean> {
  try {
    // Get current settings or create default
    const isEnabled = await isWaitlistEmailEnabled();

    if (!isEnabled) {
      log(
        `Waitlist welcome email to ${email} skipped (emails disabled)`,
        "email",
      );
      return false;
    }

    const template = await getWaitlistEmailTemplate();

    const textContent = template.textContent.replace(/{{name}}/g, name);
    const htmlContent = template.htmlContent.replace(/{{name}}/g, name);

    log(`Sending waitlist welcome email to ${email}`, "email");

    return sendEmail({
      to: email,
      subject: template.subject,
      text: textContent,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Failed to send waitlist welcome email:", error);
    log(`Failed to send waitlist welcome email to ${email}: ${error}`, "email");
    return false;
  }
}
