namespace KuktaService
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class FoodModel : DbContext
    {
        public FoodModel()
            : base("name=Kuktadb")
        {
        }

        public virtual DbSet<Employee> Employee { get; set; }
        public virtual DbSet<Foods> Foods { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>()
                .Property(e => e.email)
                .IsUnicode(false);

            modelBuilder.Entity<Foods>()
                .Property(e => e.Desc)
                .IsUnicode(false);
        }
    }
}
