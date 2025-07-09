using AppDock.Services.PortfolioAPI.Models.DTO;

namespace AppDock.Services.PortfolioAPI.Services.IServices
{
    public interface IProjectService
    {
        Task<string> CreateProjectAsync(ProjectDto projectDto);
        Task<string> UpdateProjectAsync(ProjectDto projectDto);
        Task<IEnumerable<ProjectDto>> GetAllProjectsAsync(string portfolioId);
        Task<ProjectDto> GetProjectByIdAsync(string projectId);
        Task<string> DeleteProjectAsync(string projectId);
    }
}
