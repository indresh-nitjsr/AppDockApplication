using AppDock.Services.PortfolioAPI.Models.DTO;

namespace AppDock.Services.PortfolioAPI.Services.IServices
{
    public interface IExperienceService
    {
        Task<string> CreateExperienceAsync(ExperienceDto experienceDto);
        Task<IEnumerable<ExperienceDto>> GetAllExperienceAsync(string portfolioId);
        Task<string> UpdateExperienceAsync(ExperienceDto experienceDto);
        Task<ExperienceDto> GetExperienceByIdAsync(string experienceId);
        Task<string> DeleteExperienceAsync(string experienceId);
    }
}
