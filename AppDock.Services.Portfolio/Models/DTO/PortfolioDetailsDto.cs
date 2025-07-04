namespace AppDock.Services.PortfolioAPI.Models.DTO
{
    public class PortfolioDetailsDto
    {
        public int Id { get; set; }

        public string Role { get; set; }

        public DateTime DOB { get; set; }

        // These fields are fetched from Auth service
        public string UserName { get; set; }

        public string UserEmail { get; set; }
    }
}
