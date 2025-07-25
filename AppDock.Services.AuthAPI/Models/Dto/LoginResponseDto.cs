namespace AppDock.Services.AuthAPI.Models.Dto
{
    public class LoginResponseDto
    {
        public AppDockUserDto User { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string Message { get; set; } // Optional for detailed error
    }
}
