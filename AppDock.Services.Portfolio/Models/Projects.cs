using AppDock.PortfolioService.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDock.Services.PortfolioAPI.Models
{
    public class Projects
    {
        [Key]
        public string Id { get; set; }
        [ForeignKey("Portfolio")]
        public string PortfolioId { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string TechStack { get; set; } // e.g., "Angular, .NET, Tailwind"
        public string Role { get; set; }
        public string LiveLink { get; set; }
        public string RepoLink { get; set; }

        // Navigation
        public UserPortfolio Portfolio { get; set; }
    }
}
