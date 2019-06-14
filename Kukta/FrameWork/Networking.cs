using Auth0.OidcClient;
using IdentityModel.OidcClient;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.FrameWork
{
    class Networking
    {
        private static Auth0Client Client;
        private static LoginResult aResult;

        private static void InitClient()
        {
            Client = new Auth0Client(new Auth0ClientOptions
            {
                Domain = "kukta.eu.auth0.com",
                ClientId = "Dqp8IjQxj6Afkkgkvfk1BnYwYg65MtXC"
            });
        }

        public async static Task<LoginResult> SignUpLogin()
        {

            var extraParameters = new Dictionary<string, string>();
            extraParameters.Add("audience", "https://kuktaservice.azurewebsites.net/");
            if (Client == null)
                InitClient();
            var result = await Client.LoginAsync(extraParameters);
            
            if (result.IsError)
            {
                Debug.WriteLine($"An error occurred during login: {result.Error}");
            }
            else
            {
                Debug.WriteLine($"id_token: {result.IdentityToken}");
                Debug.WriteLine($"access_token: {result.AccessToken}");
            }
            aResult = result;
            return result;
        }

    }
}
