using Auth0.OidcClient;
using IdentityModel.OidcClient;
using Kukta.UI;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;
using Windows.UI.Xaml;

namespace Kukta.FrameWork
{
    public delegate void LoginDelegate(LoginResult result);
    class Networking
    {
        private static Auth0Client Client;
        public static event LoginDelegate LoginChanged;
        public static LoginResult aResult;

        public static Networkinfo info { get; set; } = null;

        private static void InitClient()
        {
            Auth0ClientOptions clientOptions = new Auth0ClientOptions()
            {
                Domain = "kukta.eu.auth0.com",
                ClientId = "Dqp8IjQxj6Afkkgkvfk1BnYwYg65MtXC"
            };
            clientOptions.PostLogoutRedirectUri = clientOptions.PostLogoutRedirectUri;
            Client = new Auth0Client(clientOptions);


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
            await GetUserInfo();
            LoginChanged?.Invoke(aResult);

            return result;
        }

        private static async Task GetUserInfo()
        {
            var infoResult = await Networking.GetRequestWithForceAuth("userdata", new Dictionary<string, object>());
            info = Networkinfo.FromJson(infoResult.Content);
        }
        public static async Task ChangeUserInfo(string username, string winid, string role, string email, string profilpic)
        {
            var infoJObj = new JObject();

            if (username != null) infoJObj.Add("username", username);
            if (winid != null) infoJObj.Add("winid", winid);
            if (role != null) infoJObj.Add("role", role);
            if (email != null) infoJObj.Add("email", email);
            if (profilpic != null) infoJObj.Add("profilpic", profilpic);

            var infoResult = await PostRequestWithForceAuth("userdata", infoJObj.ToString(Newtonsoft.Json.Formatting.None));
            info = Networkinfo.FromJson(infoResult.Content);
            return;
        }


        internal static async Task Logout()
        {
            var res = await Client.LogoutAsync(true);

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
            return null;
        }

        public static async Task<IRestResponse> PostRequestWithForceAuth(string path, string body)
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

            var response = App.RestClient.Post(request);
            await checkResponse(response);
            return response;
        }
        public static async Task<IRestResponse> JpegImageUploadWithAuth(string resource, Dictionary<string, object> query, StorageFile file)
        {
            var request = new RestRequest(resource, Method.POST);
            if (Networking.aResult?.AccessToken == null)
            {
                await Networking.SignUpLogin();
            }
            request.AddHeader("Authorization", "Bearer " + Networking.aResult.AccessToken);
            foreach (string name in query.Keys.ToArray())
            {
                request.AddParameter(name, query[name], ParameterType.QueryString);
            }

            if (file != null)
            {
                request.AddFile("foo", file.Path, "image/jpeg");
            }
            else
            {
                return null;
            }

            var response = App.RestClient.Post(request);
            await checkResponse(response);
            return response;
        }
        public static async Task<IRestResponse> DeleteRequestWithForceAuth(string path, Dictionary<string, object> query)
        {
            var request = new RestRequest(path, Method.DELETE);
            if (Networking.aResult?.AccessToken == null)
            {
                await Networking.SignUpLogin();
            }
            request.AddHeader("Authorization", "Bearer " + Networking.aResult.AccessToken);
            foreach (string name in query.Keys.ToArray())
            {
                request.AddParameter(name, query[name], ParameterType.QueryString);
            }
            //request.AddParameter("_id", _, ParameterType.QueryString);

            var response = App.RestClient.Delete(request);
            await checkResponse(response);
            return response;
        }
        public static async Task<IRestResponse> GetRequestWithForceAuth(string path, Dictionary<string, object> query)
        {
            var request = new RestRequest(path, Method.GET);
            if (Networking.aResult?.AccessToken == null)
            {
                await Networking.SignUpLogin();
            }
            request.AddHeader("Authorization", "Bearer " + Networking.aResult.AccessToken);
            if (query != null)
            {
                foreach (string name in query.Keys.ToArray())
                {
                    request.AddParameter(name, query[name], ParameterType.QueryString);
                }
            }

            var response = App.RestClient.Get(request);
            await checkResponse(response);
            return response;
        }
        public static async Task<IRestResponse> GetRequestSimple(string path, Dictionary<string, object> query)
        {
            var request = new RestRequest(path, Method.GET);
            if (Networking.aResult?.AccessToken != null)
            {
                request.AddHeader("Authorization", "Bearer " + Networking.aResult.AccessToken);
            }
            request.RequestFormat = DataFormat.Json;
            foreach (string name in query.Keys.ToArray())
            {
                request.AddParameter(name, query[name], ParameterType.QueryString);
            }
            var response = App.RestClient.Get(request);
            await checkResponse(response);

            return response;
        }

        private static async Task checkResponse(IRestResponse response)
        {
            try
            {
                if (response.StatusCode == HttpStatusCode.Forbidden
                    || response.StatusCode == HttpStatusCode.RequestTimeout
                    || response.StatusCode == HttpStatusCode.InternalServerError
                    || response.StatusCode == HttpStatusCode.ServiceUnavailable
                    || response.StatusCode == 0)
                {
                    App.Sendnotification("Hiba a szerverrel való kommunikációban.", "Hiba a kérés küldésekor: " + response.Request.Resource + " Hibakód: " + response.StatusCode);
                    await new ServicesNotAvailable().ShowAsync();
                    return;
                }

            }
            catch
            {
                return;
            }
            return;
        }
    }
}
