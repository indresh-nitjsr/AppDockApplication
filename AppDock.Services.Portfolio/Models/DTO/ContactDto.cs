namespace AppDock.Services.PortfolioAPI.Models.DTO
{
    public class ContactDto
    {
        public string PortfolioId { get; set; }
        public string UserId { get; set; }
        public string Address { get; set; } = "";
        public string LinkedInUrl { get; set; } = "";
        public string GitHubUrl { get; set; } = "";
        public string TwitterUrl { get; set; } = "";
    }
}
