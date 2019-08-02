using IdentityModel.OidcClient;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Networking
{
    internal class User
    {
        internal static string AccesToken { get; private set; }
        internal static string DisplayName { get; private set; }
        internal static string Role { get; private set; }
        internal static string Email { get; private set; }
        internal static string ProfilPic { get; private set; }
        private static LoginResult LoginResult;
        internal static bool IsLoggedIn { get; private set; }
        internal static Task Init(LoginResult result)
        {
            LoginResult = result;

            ProfilPic = GetClaim("picture");
            Email = GetClaim("email");

        }
        internal static void Clear()
        {
            AccesToken = null;
            DisplayName = null;
            Role = null;
            Email = null;
            ProfilPic = null;
            LoginResult = null;

            IsLoggedIn = false;
        }
        private static string GetClaim(string type)
        {
            if (LoginResult != null && !LoginResult.IsError)
            {
                foreach (Claim cl in LoginResult?.User?.Claims)
                {
                    if (cl.Type == type)
                    {
                        return cl.Value;
                    }
                }
            }
            return null;
        }
    }
}
