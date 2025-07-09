using AppDock.PortfolioService.Models;
using System.ComponentModel.DataAnnotations;

namespace AppDock.Services.PortfolioAPI.Models
{
    public class Skill
    {
        [Key]
        public string Id { get; set; }
        [Required]
        public string PortfolioId { get; set; }
        public string SkillName { get; set; } = "";
        public string ProficiencyLevel { get; set; } = "";
        public string SkillType { get; set; } = "";

        // Navigation
        public UserPortfolio Portfolio { get; set; }
    }
}
