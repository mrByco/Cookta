using IdentityModel.OidcClient;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Networking
{
    public class Networking
    {

        private static RestClient Client { get; set; }
        internal static void Init(bool debugServer)
        {
            Client = new RestClient(debugServer ? "http://localhost:1337/" : "https://kuktaservices.azurewebsites.net/");
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="path">The path where the resquest send eg.: 'ingredient' means: [serverroot]/ingredients.</param>
        /// <param name="body">The body of the request, leave it null, id it has no body</param>
        /// <returns>Retruns an IRestResponse after a filter</returns>
        public static async Task<IRestResponse> PostRequestWithForceAuth(string path, string body)
        {
            var request = new RestRequest(path, Method.POST);
            if (User.AccessToken == null)
            {
                await Cookta.DoLogin();
            }
            request.AddHeader("Authorization", "Bearer " + User.AccessToken);
            request.RequestFormat = DataFormat.Json;
            request.AddHeader("Content-Type", "application/json");
            request.AddJsonBody(body);

            var response = Client.Post(request);
            checkResponse(response);
            return response;
        }
        public static async Task<IRestResponse> JpegImageUploadWithAuth(string resource, Dictionary<string, object> query, string filePath)
        {
            var request = new RestRequest(resource, Method.POST);
            var token = await GetAccessToken();
            request.AddHeader("Authorization", "Bearer " + token);
            foreach (string name in query.Keys.ToArray())
            {
                request.AddParameter(name, query[name], ParameterType.QueryString);
            }

            if (filePath != null)
            {
                request.AddFile("foo", filePath, "image/jpeg");
            }
            else
            {
                return null;
            }

            var response = Client.Post(request);
            checkResponse(response);
            return response;
        }
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public static async Task<IRestResponse> DeleteRequestWithForceAuth(string path, Dictionary<string, object> query)
        {
            var request = new RestRequest(path, Method.DELETE);
            if (User.AccessToken == null)
            {
                return null;
            }
            request.AddHeader("Authorization", "Bearer " + User.AccessToken);
            foreach (string name in query.Keys.ToArray())
            {
                request.AddParameter(name, query[name], ParameterType.QueryString);
            }

            var response = Client.Delete(request);
            checkResponse(response);
            return response;
        }
        public static async Task<IRestResponse> GetRequestWithForceAuth(string path, Dictionary<string, object> query)
        {
            var request = new RestRequest(path, Method.GET);
            var token = await GetAccessToken();
            request.AddHeader("Authorization", "Bearer " + token);
            if (query != null)
            {
                foreach (string name in query.Keys.ToArray())
                {
                    request.AddParameter(name, query[name], ParameterType.QueryString);
                }
            }

            var response = Client.Get(request);
            checkResponse(response);
            return response;
        }
        public static async Task<IRestResponse> GetRequestSimple(string path, Dictionary<string, object> query)
        {
            var request = new RestRequest(path, Method.GET);
            if (User.AccessToken != null)
            {
                request.AddHeader("Authorization", "Bearer " + User.AccessToken);
            }
            request.RequestFormat = DataFormat.Json;
            foreach (string name in query.Keys.ToArray())
            {
                request.AddParameter(name, query[name], ParameterType.QueryString);
            }
            var response = Client.Get(request);
            checkResponse(response);

            return response;
        }
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
        private static async Task<string> GetAccessToken()
        {
            if (User.AccessToken == null)
            {
                await User.LoginUser();

            }
            return User.AccessToken;

        }
        private static void checkResponse(IRestResponse response)
        {
            try
            {
                if (response.StatusCode == HttpStatusCode.RequestTimeout
                    || response.StatusCode == 0 || response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    Cookta.SendNotification("Hiba a szerverrel való kommunikációban.", "Hiba a kérés küldésekor: " + response.Request.Resource + " Hibakód: " + response.StatusCode);
                    //await new ServicesNotAvailable().ShowAsync();
                    throw new Exception();
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
