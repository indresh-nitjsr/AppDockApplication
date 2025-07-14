using AppDock.PortfolioService.Models;
using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.ExternalServices;
using AppDock.Services.PortfolioAPI.ExternalServices.IExternalServices;
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
        private readonly IAuthService _authService;
        private readonly IAboutService _aboutService;
        private readonly ISkillService _skillService;
        //private readonly Mapper _mapper;
        private readonly IProjectService _projectService;
        private readonly ICertificateService _certificateService;
        private readonly IExperienceService _experienceService;
        private readonly IContactService _contactService;

        public PortfolioService(
            ApplicationDbContext context, 
            IAuthService authService, 
            IAboutService aboutService, 
            IProjectService projectService,
            ICertificateService certificateService,
            IMapper mapper,  
            ISkillService skillService,
            IExperienceService experienceService, IContactService contactService
           )
        {
            _context = context;
            _authService = authService;
            _aboutService = aboutService;
            _projectService = projectService;
            _certificateService = certificateService;
            _skillService = skillService;
            _experienceService = experienceService;
            _contactService = contactService;
        }



        public async Task<string> CreatePortfolioAsync(PortfolioDto portfolioDto, string email)
        {
            // Check if user exists
            UserDto user = await _authService.GetUserByEmailAsync(email);
            if (user == null || string.IsNullOrEmpty(user.userId))
            {
                return "Failed : User not found or user ID missing.";
            }

            // Check if user already exists in users table
            var existingUser = await _context.users.FindAsync(user.userId);
            if (existingUser == null)
            {
                await _context.users.AddAsync(new User
                {
                    userId = user.userId,
                    Email = user.Email,
                    Name = user.Name,
                    PhoneNumber = user.PhoneNumber
                });
            }

            // Check if portfolio already exists for user
            var existingPortfolio = await _context.portfolios
                .FirstOrDefaultAsync(p => p.UserId == user.userId);

            if (existingPortfolio != null)
            {
                return "Failed : Portfolio already exists for this user.";
            }

            // Validate portfolio data
            if (string.IsNullOrEmpty(portfolioDto.Role))
            {
                return "Failed : Role is required.";
            }

            if (portfolioDto.DOB == default || portfolioDto.DOB > DateTime.Now)
            {
                return "Failed : Invalid date of birth.";
            }

            // Create new portfolio
            UserPortfolio userPortfolio = new()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.userId,
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

                _context.portfolios.Update(userPortfolio);
                await _context.SaveChangesAsync();

                return "Portfolio updated successfully!";
            }
            catch (Exception ex)
            {
                return $"Failed to update portfolio: {ex.Message}";
            }
        }

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

            var about = await _aboutService.GetAboutAsync(user.userId);
            var projects = await _projectService.GetAllProjectsAsync(portfolio.Id);
            var certificates = await _certificateService.GetCertificatesAsync(portfolio.Id);
            var skills = await _skillService.GetAllSkillAsync(portfolio.Id);
            var experiences = await _experienceService.GetAllExperienceAsync(portfolio.Id);
            var contact = await _contactService.GetContactAsync(user.userId);

            PortfolioDetailsDto portfolioDetails = new PortfolioDetailsDto();
            portfolioDetails.Id = portfolio.Id;
            portfolioDetails.user = user;
            portfolioDetails.Role = portfolio.Role;
            portfolioDetails.DOB = portfolio.DOB;
            portfolioDetails.About = about;
            portfolioDetails.Projects = projects;
            portfolioDetails.Certificates = certificates;
            portfolioDetails.Skills = skills;
            portfolioDetails.Experiences = experiences;
            portfolioDetails.Contact = contact;
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
