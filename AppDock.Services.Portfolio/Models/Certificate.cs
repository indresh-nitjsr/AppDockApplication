using AppDock.PortfolioService.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppDock.Services.PortfolioAPI.Models
{
    public class Certificate
    {
        [Key]
        public string Id { get; set; }
        [ForeignKey("Portfolio")]
        public string PortfolioId { get; set; }
        public UserPortfolio Portfolio { get; set; } // navigation property
        public string Title { get; set; }
        public string Issuer { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string Description { get; set; }
        public string CertificateUrl { get; set; }
        public string type { get; set; }
    }
}
