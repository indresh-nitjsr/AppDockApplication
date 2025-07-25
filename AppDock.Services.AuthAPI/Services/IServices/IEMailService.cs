using AppDock.Services.AuthAPI.Models.Dto;

namespace AppDock.Services.AuthAPI.Services.IServices
{
    public interface IEMailService
    {
        Task<bool> SendVerificationEmail(string toEmail, string verificationLink);
    }
}
