namespace AppDock.Services.AuthAPI.Models.Dto
{
    public class LoginRequestDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
