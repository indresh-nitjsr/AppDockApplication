using AppDock.PortfolioService.Models;
using AppDock.Services.PortfolioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AppDock.Services.PortfolioAPI.Data
{
    public class ApplicationDbContext : DbContext 
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) 
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Portfolio and About 1:1 relationship
            modelBuilder.Entity<UserPortfolio>()
                .HasOne(p => p.About)
                .WithOne(a => a.Portfolio)
                .HasForeignKey<About>(a => a.PortfolioId);

            modelBuilder.Entity<UserPortfolio>()
                .HasMany(p => p.Projects)
                .WithOne(pr => pr.Portfolio)
                .HasForeignKey(pr => pr.PortfolioId);

            modelBuilder.Entity<UserPortfolio>()
                .HasOne(p => p.Contact)
                .WithOne(c => c.Portfolio)
                .HasForeignKey<Contact>(c => c.PortfolioId);

            modelBuilder.Entity<UserPortfolio>()
                .HasMany(p => p.Experiences)
                .WithOne(e => e.Portfolio)
                .HasForeignKey(e => e.PortfolioId);

            modelBuilder.Entity<UserPortfolio>()
                .HasMany(p => p.Certificates)
                .WithOne(e => e.Portfolio)
                .HasForeignKey(e => e.PortfolioId);

            modelBuilder.Entity<UserPortfolio>()
                .HasMany(p => p.Skills)
                .WithOne(e => e.Portfolio)
                .HasForeignKey(e => e.PortfolioId);

            // You can also configure other relationships here if needed

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<User> users {  get; set; }
        public DbSet<UserPortfolio> portfolios {  get; set; }
        public DbSet<About> about {  get; set; }
        public DbSet<Contact> contact {  get; set; }
        public DbSet<Experience> experiences {  get; set; }
        public DbSet<Certificate> certificates {  get; set; }
        public DbSet<Projects> projects {  get; set; }
        public DbSet<Skill> skills {  get; set; }


    }
}
