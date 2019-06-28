using Auth0.OidcClient;
using IdentityModel.OidcClient;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;

namespace Kukta.FrameWork
{
    public delegate void LoginDelegate(LoginResult result);
    class Networking
    {
        private static Auth0Client Client;
        public static event LoginDelegate LoginChanged;
        public static LoginResult aResult;

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
            LoginChanged.Invoke(aResult);
            return result;
        }


        internal static void Logout(object sender, RoutedEventArgs e)
        {
            Client.LogoutAsync();
            aResult = null;
            LoginChanged.Invoke(aResult);
        }

        public static string GetClaim(string type)
        {
            if (aResult != null && !aResult.IsError)
            {
                foreach (Claim cl in aResult?.User?.Claims)
                {
                    if (cl.Type == type)
                    {
                        return cl.Value;
                    }
                }
            }
            return "Unvailable.";
        }

        public static async Task<IRestResponse> PutRequestWithForceAuth(string path, string body)
        {
            var request = new RestRequest(path, Method.POST);
            if (Networking.aResult?.AccessToken == null)
            {
                await Networking.SignUpLogin();
            }
            request.AddHeader("Authorization", "Bearer " + Networking.aResult.AccessToken);
            request.RequestFormat = DataFormat.Json;
            request.AddHeader("Content-Type", "application/json");
            request.AddJsonBody(body);

            return App.RestClient.Post(request);
        }
        public static async Task<IRestResponse> DeleteRequestWithForceAuth(string path, string _id)
        {
            var request = new RestRequest(path, Method.DELETE);
            if (Networking.aResult?.AccessToken == null)
            {
                await Networking.SignUpLogin();
            }
            request.AddHeader("Authorization", "Bearer " + Networking.aResult.AccessToken);
            request.AddParameter("_id", _id, ParameterType.QueryString);

            return App.RestClient.Delete(request);
        }
        public static async Task<IRestResponse> GetRequestWithForceAuth(string path, string id)
        {
            var request = new RestRequest(path, Method.GET);
            if (Networking.aResult?.AccessToken == null)
            {
                await Networking.SignUpLogin();
            }
            request.AddHeader("Authorization", "Bearer " + Networking.aResult.AccessToken);
            request.RequestFormat = DataFormat.Json;
            request.AddParameter("_id", id, ParameterType.QueryString);

            return App.RestClient.Get(request);
        }
        public static async Task<IRestResponse> GetRequestSimple(string path, string id)
        {
            var request = new RestRequest(path, Method.GET);
            if (Networking.aResult.AccessToken != null)
            {
                request.AddHeader("Authorization", "Bearer " + Networking.aResult.AccessToken);
            }
            request.RequestFormat = DataFormat.Json;
            request.AddParameter("_id", id, ParameterType.QueryString);

            return App.RestClient.Get(request);
        }

        /* public static async Task<string> GetRequest()
         {

         }*/
    }
}
