using AppDock.PortfolioService.Models;

namespace AppDock.Services.PortfolioAPI.Models
{
    public class About
    {
        public string Id { get; set; }
        public string Heading { get; set; } = "";
        public string Description { get; set; } = "";
        public string ProfileImageUrl { get; set; } = "";

        //Foreign Key
        public string UserId { get; set; }
        public string PortfolioId { get; set; }

        // Navigation
        public UserPortfolio Portfolio { get; set; }
    }
}
