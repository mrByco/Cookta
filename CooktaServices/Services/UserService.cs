using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using CooktaServices.Data;
using CooktaServices.Domain.Account;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CooktaServices.Services
{
    public class UserService : AServiceBase, IUserService
    {
        public UserService(DataContext dataContext) : base(dataContext)
        {
        }
        
        public async Task<User> GetAsync(HttpContext context)
        {
            var securityToken = await GetSecurityToken(context);
            var sub = securityToken.Claims.First(claim => claim.Type == "sub").Value;
            if (sub == null) return null;
            return await GetAsync(sub);
        }

        public async Task<User> CreateAsync(HttpContext context, string DisplayName)
        {
            var user = await GetAsync(context);
            if (user != null)
            {
                user.DisplayName = DisplayName;
                var updated = await UpdateAsync(user);
                return updated ? user : null;
            }

            var token = GetSecurityToken(context);
            user = new User();
            throw new NotImplementedException();
        }

        public async Task<User> GetAsync(string sub)
        {
            return await DataContext.Identities.FirstAsync(identity => identity.Subs.First(subClass => subClass.SubString == sub) != null);
        }
        public async Task<User> GetAsync(Guid userId)
        {
            return await DataContext.Identities.FirstAsync(identity => identity.UserId == userId); 
        }

        public async Task<bool> UpdateAsync(Domain.Account.User user)
        {
            DataContext.Identities.Update(user);
            var updated = await DataContext.SaveChangesAsync();

            return updated > 0;
        }



        private static async Task<JwtSecurityToken> GetSecurityToken(HttpContext context)
        {
            //from https://stackoverflow.com/questions/38340078/how-to-decode-jwt-token
            var token = await context.GetTokenAsync("id_token");
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            return jsonToken as JwtSecurityToken;
        }
    }
}