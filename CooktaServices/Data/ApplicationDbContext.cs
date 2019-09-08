using System;
using System.Collections.Generic;
using System.Text;
using CooktaServices.Domain;
using CooktaServices.Domain.Account;
using CooktaServices.Domain.Receipts;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CooktaServices.Data
{
    public class DataContext : IdentityDbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<Food> Foods { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<IngredientType> IngredientTypes{ get; set; }
        public DbSet<Unit> Units { get; set; }
        public new DbSet<Domain.Account.User> Users { get; set; }
        public DbSet<Family> Families { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

    }
}
