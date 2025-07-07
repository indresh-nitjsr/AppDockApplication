using AppDock.Services.AuthAPI.Models.Dto;

namespace AppDock.Services.AuthAPI.Services.IServices
{
    public interface IUserService
    {
        Task<AppDockUserDto> GetUserByEmail(string email);
    }
}
