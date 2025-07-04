namespace AppDock.Services.PortfolioAPI.Models.DTO { 
    public class ResponseDto
    {
        public object? Results { get; set; }
        public bool isSuccess { get; set; } = true;
        public string Message { get; set; } = " ";
    }
}
