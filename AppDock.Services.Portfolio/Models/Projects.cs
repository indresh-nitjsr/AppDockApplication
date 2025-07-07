using AppDock.PortfolioService.Models;

namespace AppDock.Services.PortfolioAPI.Models
{
    public class Projects
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string Technologies { get; set; } = "";
        public string ProjectUrl { get; set; } = "";
        public string GithubProjectUrl { get; set; } = "";

        // Navigation
        public UserPortfolio Portfolio { get; set; }
    }
}
