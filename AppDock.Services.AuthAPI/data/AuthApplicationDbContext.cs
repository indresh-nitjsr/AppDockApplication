using AppDock.Services.AuthAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AppDock.Services.AuthAPI.data
{
    public class AuthApplicationDbContext : IdentityDbContext<AppDockUser>
    {
        public AuthApplicationDbContext(DbContextOptions<AuthApplicationDbContext> options) : base(options)
        {
            
        
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        public DbSet<AppDockUser> AppDockUsers { get; set; }
    }
}
