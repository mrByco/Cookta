using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace CooktaServices.Contracts.Extensions
{
    public static class JwtSecurityTokenExtensions
    {
        public static string GetClaim(this JwtSecurityToken token, string type)
        {
            return token.Claims.First(claim => claim.Type == type).Value;
        }
    }
}