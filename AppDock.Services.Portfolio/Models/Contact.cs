using AppDock.PortfolioService.Models;

namespace AppDock.Services.PortfolioAPI.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }
        public string UserId { get; set; }
        public string Address { get; set; } = "";
        public string LinkedInUrl { get; set; } = "";
        public string GitHubUrl { get; set; } = "";
        public string TwitterUrl { get; set; } = "";

        // Navigation
        public UserPortfolio Portfolio { get; set; }
    }
}
