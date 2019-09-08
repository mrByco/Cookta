using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CooktaServices.Contracts.V1;
using CooktaServices.Data;
using CooktaServices.Domain;
using CooktaServices.Domain.Account;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using RestSharp;
using RestSharp.Serialization.Json;

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
            var user = await GetAsync(sub);
            if (user != null) return user;

            var info = await GetUserInfo(context);

            user = await DataContext.Users.FirstOrDefaultAsync(u => u.Email == info.email);
            // ReSharper disable once InvertIf
            if (user != null)
            {
                user.Subs.Add(new Sub {UserId = user.UserId, SubString = sub});
                await DataContext.SaveChangesAsync();
            }

            return user;
        }

        public async Task<User> CreateAsync(HttpContext context, string displayName)
        {
            var user = await GetAsync(context);
            if (user != null)
            {
                user.DisplayName = displayName;
                var updated = await UpdateAsync(user);
                return updated ? user : null;
            }

            var info = await GetUserInfo(context);

            user = new User
            {
                Email = info.email,
                Joined = DateTime.UtcNow,
                Picture = info.picture,
                Role = RoleService.DefaultRole,
                UserId = Guid.NewGuid(),
                DisplayName = displayName
            };
            user.Subs = new List<Sub> {new Sub {UserId = user.UserId, SubString = info.sub}};
            user.CurrentFamily = new Family {Created = DateTime.Now, Name = $"{user.DisplayName} családja"};

            DataContext.Users.Add(user);
            var created = await DataContext.SaveChangesAsync();

            return created > 0 ? user : null;
        }

        public async Task<User> GetAsync(string sub)
        {
            return await DataContext.Users.FirstOrDefaultAsync(identity =>
                identity.Subs.FirstOrDefault(subClass => subClass.SubString == sub) != null);
        }

        public async Task<User> GetAsync(Guid userId)
        {
            return await DataContext.Users.FirstAsync(identity => identity.UserId == userId);
        }

        public async Task<bool> UpdateAsync(Domain.Account.User user)
        {
            DataContext.Users.Update(user);
            var updated = await DataContext.SaveChangesAsync();

            return updated > 0;
        }

        private static async Task<UserinfoResponse> GetUserInfo(HttpContext context)
        {
            var accessToken = await context.GetTokenAsync("access_token");

            var client = new RestClient("https://kukta.eu.auth0.com/userinfo");
            var request = new RestRequest(Method.GET);
            request.AddHeader("Authorization", $"Bearer {accessToken}");

            var response = client.Execute(request);
            UserinfoResponse info = null;
            if (response.StatusCode == HttpStatusCode.OK)
            {
                info = new JsonDeserializer().Deserialize<UserinfoResponse>(response);
            }

            return info;
        }

        private static async Task<JwtSecurityToken> GetSecurityToken(HttpContext context)
        {
            //from https://stackoverflow.com/questions/38340078/how-to-decode-jwt-token
            var token = await context.GetTokenAsync("access_token");
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            return jsonToken as JwtSecurityToken;
        }
    }
}