using AppDock.Services.AuthAPI.Models.Dto;

namespace AppDock.Services.AuthAPI.Services.IServices
{
    public interface IUserService
    {
        Task<AppDockUserDto> GetUserByEmail(string email);
        Task<AppDockUserDto> GetUserByVerificationToken(string token);
        Task<AppDockUserDto> UpdateUserAsync(AppDockUserDto appdockUserDto);
    }
}
