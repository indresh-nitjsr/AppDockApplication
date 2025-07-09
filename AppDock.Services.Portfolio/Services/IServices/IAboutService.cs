using AppDock.Services.PortfolioAPI.Models.DTO;

namespace AppDock.Services.PortfolioAPI.Services.IServices
{
    public interface IAboutService
    {
        Task<string> AddOrUpdateAboutAsync(AboutDto aboutDto);
        Task<AboutDto> GetAboutAsync(string userId);
    }
}
