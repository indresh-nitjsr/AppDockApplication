using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.Models;
using AppDock.Services.PortfolioAPI.Models.DTO;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AppDock.Services.PortfolioAPI.Services.IServices;

namespace AppDock.Services.PortfolioAPI.Services
{
    public class AboutService : IAboutService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AboutService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<string> AddOrUpdateAboutAsync(AboutDto aboutDto)
        {
            try
            {
                // Check if about section already exists for this portfolio
                var about = await _context.about
                    .FirstOrDefaultAsync(a => a.PortfolioId == aboutDto.PortfolioId);

                if (about == null)
                {
                    // Create new About
                    about = _mapper.Map<About>(aboutDto);
                    await _context.about.AddAsync(about);
                    await _context.SaveChangesAsync();
                    return "About section created successfully!";
                }
                else
                {
                    // Update existing About
                    about.Description = aboutDto.Description;
                    about.Heading = aboutDto.Heading;
                    about.ProfileImageUrl = aboutDto.ProfileImageUrl;
                    about.UserId = aboutDto.UserId;
                    about.PortfolioId = aboutDto.PortfolioId;
                    //about = _mapper.Map<About>(aboutDto);
                    // update other fields as needed

                    _context.about.Update(about);
                    await _context.SaveChangesAsync();
                    return "About section updated successfully!";
                }
            }
            catch (Exception ex)
            {
                return $"Failed to add/update About section: {ex.Message}";
            }
        }

        public async Task<AboutDto> GetAboutAsync(int portfolioId)
        {
            var about = await _context.about
                .FirstOrDefaultAsync(a => a.PortfolioId == portfolioId);

            if (about == null)
            {
                return null;
            }

            var aboutDto = _mapper.Map<AboutDto>(about);
            return aboutDto;
        }
    }
}
