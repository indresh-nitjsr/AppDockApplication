using AppDock.PortfolioService.Models;
using System.ComponentModel.DataAnnotations;

namespace AppDock.Services.PortfolioAPI.Models
{
    public class Skill
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int PortfolioId { get; set; }
        public string SkillName { get; set; } = "";
        public string ProficiencyLevel { get; set; } = "";
        public string SkillType { get; set; } = "";

        // Navigation
        public UserPortfolio Portfolio { get; set; }
    }
}
