namespace AppDock.Services.PortfolioAPI.Models.DTO
{
    public class PortfolioDetailsDto
    {
        public int Id { get; set; }

        public string Role { get; set; }

        public DateTime DOB { get; set; }

        public UserDto user { get; set; }
        public AboutDto About { get; set; }
    }
}
