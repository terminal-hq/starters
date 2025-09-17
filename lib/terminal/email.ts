/**
 * This is a service for sending authentication emails handled by Terminal Labs. You can easily swap this function out with your own email sending logic.
 * For "reset-password" emails, the email configuration is as follows:
 * {
 *   from: `${appName} Notification <notification@apps.terminalhq.com>`,
 *   to: to,
 *   subject: "Reset your password",
 *   text: `Click the link to reset your password: ${data.resetLink}`,
 * }
 */
export const sendEmail = async ({
  to,
  data,
}: {
  to: string;
  data: {
    [key: string]: string;
  };
}) => {
  const response = await fetch(`${process.env.TERMINAL_END_POINT}/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.TERMINAL_API_KEY!,
    },
    body: JSON.stringify({ to, data, appName: process.env.APP_NAME }),
  });
  return response.json();
};
