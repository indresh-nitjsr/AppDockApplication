using AppDock.PortfolioService.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDock.Services.PortfolioAPI.Models
{
    public class Skill
    {
        [Key]
        public string Id { get; set; }
        [ForeignKey("Portfolio")]
        public string PortfolioId { get; set; }

        public string Skills { get; set; } = "";
        // Navigation

        public UserPortfolio Portfolio { get; set; }

    }
}
