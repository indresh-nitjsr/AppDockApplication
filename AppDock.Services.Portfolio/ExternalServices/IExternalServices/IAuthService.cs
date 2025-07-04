using AppDock.Services.PortfolioAPI.Models.DTO;

namespace AppDock.Services.PortfolioAPI.ExternalServices.IExternalServices
{
    public interface IAuthService
    {
        Task<UserDto> GetUserByIdAsync(string userId);
    }
}
