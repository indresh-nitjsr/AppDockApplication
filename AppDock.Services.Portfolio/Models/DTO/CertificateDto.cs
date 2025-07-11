namespace AppDock.Services.PortfolioAPI.Models.DTO
{
    public class CertificateDto
    {
        public string Id { get; set; }
        public string PortfolioId { get; set; }
        public string Title { get; set; }
        public string Issuer { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string Description { get; set; }
        public string CertificateUrl { get; set; }
    }

}
