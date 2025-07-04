
namespace AppDock.Services.PortfolioAPI.Models.DTO
{
    public class PortfolioResponseDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Role { get; set; } = "";
        public DateTime DOB { get; set; }

        // Navigation
        public About About { get; set; }
        public Contact Contact { get; set; }
        public ICollection<Experience> Experiences { get; set; }
        public ICollection<Projects> Projects { get; set; }
        public ICollection<Skill> Skills { get; set; }
    }
}
