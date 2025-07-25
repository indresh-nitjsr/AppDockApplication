using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AppDock.Services.AuthAPI.Models
{
    public class AppDockUser : IdentityUser
    {
        [Required]
        public string Name { get; set; }
        public bool IsEmailVerified { get; set; }
        public string EmailVerificationToken { get; set; }

    }
}
