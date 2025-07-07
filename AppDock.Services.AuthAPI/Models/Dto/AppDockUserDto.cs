namespace AppDock.Services.AuthAPI.Models.Dto
{
    public class AppDockUserDto
    {
        public string userId { get; set; }
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
    }
}
