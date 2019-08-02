using Cooktapi.Networking;
using IdentityModel.OidcClient;
using System;
using System.Threading.Tasks;

namespace Cooktapi
{
    public static class Cookta
    {
        public static Task<bool> InitUser(LoginResult result, Action<LoginResult> DoLogin, Action <Task> DoLogout)
        {
            User.Init(result, DoLogin, DoLogout);
        }
        public static Task UnInitCurrentUser()
        {

        }
    }
}
