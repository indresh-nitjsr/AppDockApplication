using AppDock.PortfolioService.Models;

namespace AppDock.Services.PortfolioAPI.Models
{
    public class Experience
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }
        public string Title { get; set; } = "";
        public string CompanyName { get; set; } = "";
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Description { get; set; } = "";

        // Navigation
        public UserPortfolio Portfolio { get; set; }
    }
}
