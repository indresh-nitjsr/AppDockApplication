using System.ComponentModel.DataAnnotations.Schema;

namespace AppDock.Services.PortfolioAPI.Models.DTO
{
    public class SkillDto
    {
        public string SkillId { get; set; }
        public string PortfolioId { get; set; }
        public string Skills { get; set; } = "";
        public int Proficiency { get; set; }
    }
}
