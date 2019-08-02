using RestSharp;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Networking
{
    internal class Networking
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="path"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static async Task<IRestResponse> PostRequestWithForceAuth(string path, string body)
        {
            var request = new RestRequest(path, Method.POST);
            if (User.AccessToken == null)
            {
                return null;
            }
            request.AddHeader("Authorization", "Bearer " + User.AccessToken);
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
