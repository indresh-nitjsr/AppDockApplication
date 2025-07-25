namespace AppDock.Services.AuthAPI.Models.Dto
{
    public class AppDockUserDto
    {
        public string userId { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public bool IsEmailVerified { get; set; }
        public string EmailVerificationToken { get; set; }

    }
}
