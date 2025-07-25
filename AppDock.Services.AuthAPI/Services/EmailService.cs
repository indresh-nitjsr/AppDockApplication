using AppDock.Services.AuthAPI.Services.IServices;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace AppDock.Services.AuthAPI.Services
{
    public class EmailService : IEMailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> SendVerificationEmail(string toEmail, string verificationLink)
        {
            var smtpUser = _config["SMTP:User"];
            if (string.IsNullOrWhiteSpace(smtpUser))
            {
                throw new Exception("SMTP:User is not configured in appsettings.");
            }

            var smtpPass = _config["SMTP:Pass"];
            var smtpServer = _config["SMTP:Server"];
            var smtpPort = int.Parse(_config["SMTP:Port"]);

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("AppDock", smtpUser));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = "Email Verification";
            message.Body = new TextPart("plain")
            {
                Text = $"Click the link to verify your email: {verificationLink}"
            };

            using var client = new SmtpClient();
            await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(smtpUser, smtpPass);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            return true;
        }
    }
}