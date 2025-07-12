using AppDock.PortfolioService.Models;

namespace AppDock.Services.PortfolioAPI.Models.DTO
{
    public class ExperienceDto
    {
        public string Id { get; set; }
        public string PortfolioId { get; set; }
        public string Title { get; set; } = "";
        public string EmployementType { get; set; }
        public string CompanyName { get; set; } = "";
        public bool IsCurrentlyWorking { get; set; } = false;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Description { get; set; } = "";
    }
}
