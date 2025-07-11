using AppDock.Services.PortfolioAPI.Models.DTO;

namespace AppDock.Services.PortfolioAPI.Services.IServices
{
    public interface ISkillService
    {
        Task<string> CreateSkillAsync(SkillDto skillDto);
        Task<IEnumerable<SkillDto>> GetAllSkillAsync(string portfolioId);
        Task<string> UpdateSkillAsync(SkillDto skillDto);
        Task<SkillDto> GetSkillByIdAsync(string skillId);
        Task<string> DeleteSkillAsync(string skillId);
    }
}
