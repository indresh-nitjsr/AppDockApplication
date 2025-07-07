using AppDock.PortfolioService.Models;
using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.ExternalServices;
using AppDock.Services.PortfolioAPI.Models;
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
        private readonly AboutService _aboutService;

        public PortfolioService(ApplicationDbContext context, IMapper mapper, AuthService authService, AboutService aboutService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _aboutService = aboutService;
        }



        public async Task<string> CreatePortfolioAsync(PortfolioDto portfolioDto, string email)
        {
            UserDto user = await _authService.GetUserByEmailAsync(email);
            if (user == null)
            {
                return "User not found.";
            }
            else
            {
                await _context.users.AddAsync(new User
                {
                    userId = user.userId,
                    Email = user.Email,
                    Name = user.Name,
                    PhoneNumber = user.PhoneNumber
                });
            }
            UserPortfolio userPortfolio = new()
            {
                UserId = user.userId, // Here, you should set actual user ID dynamically!
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

        public async Task<string> UpdatePortfolioAsync(PortfolioDto portfolioDto, string email)
        {
            try
            {
                UserDto user = await _authService.GetUserByEmailAsync(email);
                // Find the existing portfolio by Id
                var userPortfolio = await _context.portfolios
                    .FirstOrDefaultAsync(p => p.UserId == user.userId);

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


        //public async Task<IEnumerable<PortfolioDto>> GetAllPortfolioAsync()
        //{
        //    var userPortfolios = await _context.portfolios.ToListAsync();
        //    var portfolioDtos = _mapper.Map<IEnumerable<PortfolioDto>>(userPortfolios);
        //    return portfolioDtos;
        //}

        public async Task<PortfolioDetailsDto> GetPortfolioDetailsAsync(string userId)
        {
            //var user = await _authService.GetUserByEmailAsync(email);
            if (string.IsNullOrEmpty(userId))
                return null;

            UserDto user = GetUserById(userId);
            if (user == null)
                return null;

            // Find the portfolio by user email (UserId)
            UserPortfolio portfolio = await _context.portfolios.FirstOrDefaultAsync(u => u.UserId == userId);
            if (portfolio == null)
                return null;

            var portfolioMapper = _mapper.Map<PortfolioDto>(portfolio);
            var about = await _aboutService.GetAboutAsync(portfolio.Id);

            PortfolioDetailsDto portfolioDetails = new PortfolioDetailsDto();
            portfolioDetails.user = user;
            portfolioDetails.Role = portfolioMapper.Role;
            portfolioDetails.DOB = portfolioMapper.DOB;
            portfolioDetails.About = about;
           
            return portfolioDetails;
        }

        public UserDto GetUserById(string userId)
        {
            User user = _context.users.FirstOrDefault(u => u.userId == userId);
            if (user == null)
            {
                return null; // or throw an exception if preferred
            }
            UserDto userDto = new UserDto
            {
                userId = user.userId,
                Email = user.Email,
                Name = user.Name,
                PhoneNumber = user.PhoneNumber
            };
            return userDto;
        }
    }
}
