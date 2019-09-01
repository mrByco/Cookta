using CooktaServices.Data;
using CooktaServices.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CooktaServices
{
    public class DbInstaller : IInstaller
    {
        public void InstallServices(IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(
                    config.GetConnectionString("DefaultConnection")));
            services.AddDefaultIdentity<IdentityUser>()
                .AddEntityFrameworkStores<DataContext>();


            services.AddSingleton<IFoodService, FoodService>();
        }
    }
}