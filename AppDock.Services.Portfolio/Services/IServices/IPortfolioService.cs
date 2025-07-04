using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.Models.DTO;

namespace AppDock.Services.PortfolioAPI.Services.IServices
{
    public interface IPortfolioService
    {
        Task<string> CreatePortfolioAsync(PortfolioDto portfolioDto);
        Task<string> UpdatePortfolioAsync(PortfolioDto portfolioDto);
        Task<IEnumerable<PortfolioDto>> GetAllPortfolioAsync();
        public Task<PortfolioDetailsDto> GetPortfolioDetailsAsync(int portfolioId);

    }
}
