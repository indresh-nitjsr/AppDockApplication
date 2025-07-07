using Microsoft.AspNetCore.Identity;

namespace AppDock.Services.AuthAPI.Models
{
    public class AppDockUser : IdentityUser
    {
        public string Name { get; set; }
    }
}
