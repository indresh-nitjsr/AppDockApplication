using AppDock.Services.PortfolioAPI.Data;
using AppDock.Services.PortfolioAPI.Models;
using AppDock.Services.PortfolioAPI.Models.DTO;
using AppDock.Services.PortfolioAPI.Services.IServices;
using Microsoft.EntityFrameworkCore;

namespace AppDock.Services.PortfolioAPI.Services
{
    public class ExperienceService : IExperienceService
    {
        private readonly ApplicationDbContext _context;

        public ExperienceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> CreateExperienceAsync(ExperienceDto experienceDto)
        {
            if (experienceDto == null)
                throw new ArgumentNullException(nameof(experienceDto));

            var experience = new Experience
            {
                Id = Guid.NewGuid().ToString(),
                PortfolioId = experienceDto.PortfolioId,
                Title = experienceDto.Title,
                CompanyName = experienceDto.CompanyName,
                EmployementType = experienceDto.EmployementType,
                IsCurrentlyWorking = experienceDto.IsCurrentlyWorking,
                StartDate = experienceDto.StartDate,
                EndDate = experienceDto.EndDate,
                Description = experienceDto.Description
            };

            await _context.experiences.AddAsync(experience);
            await _context.SaveChangesAsync();

            return $"Experience '{experience.Title}' created successfully.";
        }

        public async Task<string> DeleteExperienceAsync(string experienceId)
        {
            var experience = await _context.experiences.FindAsync(experienceId);

            if (experience == null)
                return "Experience not found.";

            _context.experiences.Remove(experience);
            await _context.SaveChangesAsync();

            return $"Experience with ID '{experienceId}' deleted successfully.";
        }

        public async Task<IEnumerable<ExperienceDto>> GetAllExperienceAsync(string portfolioId)
        {
            if (string.IsNullOrWhiteSpace(portfolioId))
                throw new ArgumentException("Portfolio ID cannot be null or empty.", nameof(portfolioId));

            var experiences = await _context.experiences
                .Where(e => e.PortfolioId == portfolioId)
                .ToListAsync();

            var dtos = experiences.Select(e => new ExperienceDto
            {
                Id = e.Id,
                PortfolioId = e.PortfolioId,
                Title = e.Title,
                CompanyName = e.CompanyName,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                Description = e.Description,
                EmployementType = e.EmployementType,
                IsCurrentlyWorking = e.IsCurrentlyWorking
            }).ToList();

            return dtos;
        }

        public async Task<ExperienceDto> GetExperienceByIdAsync(string experienceId)
        {
            var experience = await _context.experiences.FindAsync(experienceId);

            if (experience == null)
                return null;

            var dto = new ExperienceDto
            {
                Id = experience.Id,
                PortfolioId = experience.PortfolioId,
                Title = experience.Title,
                CompanyName = experience.CompanyName,
                StartDate = experience.StartDate,
                EndDate = experience.EndDate,
                Description = experience.Description,
                IsCurrentlyWorking = experience.IsCurrentlyWorking
            };

            return dto;
        }

        public async Task<string> UpdateExperienceAsync(ExperienceDto experienceDto)
        {
            if (experienceDto == null || string.IsNullOrWhiteSpace(experienceDto.Id))
                return "Invalid experience data.";

            var existing = await _context.experiences.FindAsync(experienceDto.Id);

            if (existing == null)
                return $"Experience with ID '{experienceDto.Id}' not found.";

            existing.Title = experienceDto.Title;
            existing.CompanyName = experienceDto.CompanyName;
            existing.StartDate = experienceDto.StartDate;
            existing.EndDate = experienceDto.EndDate;
            existing.Description = experienceDto.Description;
            existing.IsCurrentlyWorking = experienceDto.IsCurrentlyWorking;

            _context.experiences.Update(existing);
            await _context.SaveChangesAsync();

            return $"Experience '{existing.Title}' updated successfully.";
        }
    }
}
