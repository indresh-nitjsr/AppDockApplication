using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.Models.DTO;

namespace AppDock.Services.PortfolioAPI.Services.IServices
{
    public interface IPortfolioService
    {
        Task<string> CreatePortfolioAsync(PortfolioDto portfolioDto, string email);
        Task<string> UpdatePortfolioAsync(PortfolioDto portfolioDto, string email);
        //Task<IEnumerable<PortfolioDto>> GetAllPortfolioAsync();
        public Task<PortfolioDetailsDto> GetPortfolioDetailsAsync(string portfolioId);

        public Task<PortfolioDetailsDto> GetUserPortfolioDetailsAsync(string userId);
        //public UserDto getUserById(string userId);

    }
}
