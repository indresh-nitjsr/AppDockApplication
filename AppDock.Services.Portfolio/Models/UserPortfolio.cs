using AppDock.Services.PortfolioAPI.Models;
using AppDock.Services.PortfolioAPI.Models.DTO;
using System.ComponentModel.DataAnnotations;

namespace AppDock.PortfolioService.Models
{
    public class UserPortfolio
    {
        [Key]
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Role { get; set; } = "";
        [DataType(DataType.Date)]
        public DateTime DOB { get; set; }

        // Navigation
        public About About { get; set; }
        public Contact Contact { get; set; }
        public IEnumerable<Experience> Experiences { get; set; }
        public IEnumerable<Projects> Projects { get; set; }
        public IEnumerable<Skill> Skills { get; set; }
    }
}
