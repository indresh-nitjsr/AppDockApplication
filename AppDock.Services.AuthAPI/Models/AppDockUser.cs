using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AppDock.Services.AuthAPI.Models
{
    public class AppDockUser : IdentityUser
    {
        [Required]
        public string Name { get; set; }
        public bool isportfolio { get; set; } = false;
    }
}
