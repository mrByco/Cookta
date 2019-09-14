using System;
using System.Net.Http;
using System.Threading.Tasks;
using CooktaServices.Domain.Account;
using Microsoft.AspNetCore.Http;

namespace CooktaServices.Services
{

    public interface IUserService
    {
        Task<User> GetAsync(HttpContext context);
        Task<User> CreateAsync(HttpContext context, string DisplayName);
        Task<User> GetAsync(string sub);
        Task<bool> UpdateAsync(User user);
        Task<User> GetAsync(Guid userId);
    }
}