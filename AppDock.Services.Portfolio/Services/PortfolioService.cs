using AppDock.PortfolioService.Models;
using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.ExternalServices;
using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace AppDock.Services.PortfolioAPI.Services
{
    public class PortfolioService : IPortfolioService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly AuthService _authService;

        public PortfolioService(ApplicationDbContext context, IMapper mapper, AuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<string> CreatePortfolioAsync(PortfolioDto portfolioDto)
        {
            UserPortfolio userPortfolio = new()
            {
                UserId = portfolioDto.UserId, // Here, you should set actual user ID dynamically!
                Role = portfolioDto.Role,
                DOB = portfolioDto.DOB,
            };

            try
            {
                await _context.portfolios.AddAsync(userPortfolio);
                await _context.SaveChangesAsync();
                return "Portfolio created successfully!";
            }
            catch (Exception ex)
            {
                return $"Failed to create portfolio: {ex.Message}";
            }
        }

        public async Task<string> UpdatePortfolioAsync(PortfolioDto portfolioDto)
        {
            try
            {
                // Find the existing portfolio by Id
                var userPortfolio = await _context.portfolios
                    .FirstOrDefaultAsync(p => p.UserId == portfolioDto.UserId);

                if (userPortfolio == null)
                {
                    return "Portfolio not found.";
                }

                // Update fields
                userPortfolio.Role = portfolioDto.Role;
                userPortfolio.DOB = portfolioDto.DOB.Date; // Keep only date part

                // You can update other fields as needed

                _context.portfolios.Update(userPortfolio);
                await _context.SaveChangesAsync();

                return "Portfolio updated successfully!";
            }
            catch (Exception ex)
            {
                return $"Failed to update portfolio: {ex.Message}";
            }
        }


        public async Task<IEnumerable<PortfolioDto>> GetAllPortfolioAsync()
        {
            var userPortfolios = await _context.portfolios.ToListAsync();
            var portfolioDtos = _mapper.Map<IEnumerable<PortfolioDto>>(userPortfolios);
            return portfolioDtos;
        }

        public async Task<PortfolioDetailsDto> GetPortfolioDetailsAsync(int portfolioId)
        {
            var portfolio = await _context.portfolios.FindAsync(portfolioId);
            if (portfolio == null)
                return null;

            UserDto user = null;
            try
            {
                user = await _authService.GetUserByIdAsync(portfolio.UserId);
            }
            catch (Exception ex)
            {
                // _logger.LogError(ex, "Failed to fetch user from Auth service");
            }

            return new PortfolioDetailsDto
            {
                Id = portfolio.Id,
                Role = portfolio.Role,
                DOB = portfolio.DOB,
                UserName = user?.Name ?? "Unknown",
                UserEmail = user?.Email ?? "Unknown"
            };
        }

    }
}
