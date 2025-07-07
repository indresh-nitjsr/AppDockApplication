using System.ComponentModel.DataAnnotations;

namespace AppDock.Services.PortfolioAPI.Models
{
    public class User
    {
        [Key]
        public string userId { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
    }
}
