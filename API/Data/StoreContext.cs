using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        public DbSet<BasketItem> BasketItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
                .HasOne(a => a.Address)
                .WithOne(a => a.User)
                .HasForeignKey<Address>(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<BasketItem>()
                .HasOne(i => i.Basket)
                .WithMany(b => b.Items)
                .HasForeignKey(i => i.BasketId);

            builder.Entity<BasketItem>()
                .HasOne(i => i.Product);

            builder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole 
                    {
                        Id = "1",
                        Name = "Member", 
                        NormalizedName = "MEMBER"
                    },
                    new IdentityRole 
                    {
                        Id = "2",
                        Name = "Admin", 
                        NormalizedName = "ADMIN"
                    }
                );
        }
    }
}