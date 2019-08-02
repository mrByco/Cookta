using IdentityModel.OidcClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Networking
{
    public class User
    {
        public static string DisplayName { get; private set; }
        public static string ProfilPic { get; private set; }
        internal static string AccessToken { get; private set; }
        internal static string Role { get; private set; }
        internal static string Email { get; private set; }
        private static LoginResult LoginResult { get; set; }
        internal static bool IsLoggedIn { get; private set; }
        internal static async Task<bool> Init(LoginResult result)
        {
            if (!result.IsError)
            {
                LoginResult = result;
                try
                {
                    await RefreshUserData();
                    return true;
                }
                catch
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        internal static async Task RefreshUserData()
        {
            if (IsLoggedIn)
            {
                ProfilPic = GetClaim("picture");
                Email = GetClaim("email");

                JObject body = new JObject();
                if (Email != null)
                    body.Add("email", JToken.FromObject(Email));
                if (ProfilPic != null)
                    body.Add("profilpic", JToken.FromObject(Email));
                if (ProfilPic != null)
                    body.Add("username", JToken.FromObject(DisplayName));
                var result = await Networking.PostRequestWithForceAuth("userdata", body.ToString(Formatting.None));
                ApplyJson(result.Content);
            }
        }
        internal static void Clear()
        {
            AccessToken = null;
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
        private static void ApplyJson(string str)
        {
            JObject infoJObj = null;
            try
            {
                infoJObj = JObject.Parse(str);
            }
            catch (JsonReaderException e)
            {
                return;
            }
            DisplayName = infoJObj?.Value<string>("username") ?? DisplayName;
            Role = infoJObj?.Value<string>("role") ?? Role;
            Email = infoJObj?.Value<string>("email") ?? Email;
            ProfilPic = infoJObj?.Value<string>("profilpic") ?? ProfilPic;
        }


        public static void SetupForTest(string accessToken)
        {
            AccessToken = accessToken;
            ProfilPic = null;
            Email = "tester@autotester.com";
            DisplayName = string.Format("ImARobot{0}", new Random().Next(999999999));
        }
        /// <summary>
        /// Call this to change the users username.
        /// </summary>
        /// <param name="The new username."></param>
        /// <returns>The List of Errors if there are errors. If there aren't errors will return the new username. If its succesful Update the Userdata</returns>
        public static async Task<List<string>> ChangeUserName(string username)
        {
            //Validate
            var errors = await ValidateUsername(username);
            if (errors.Count == 0)
                return errors;
            //Update username
            DisplayName = username;
            await RefreshUserData();
            return new List<string>();
        }
        /// <summary>
        /// Call this to check the username is valid.
        /// </summary>
        /// <param name="username."></param>
        /// <returns>The List of Errors if there are errors. If there aren't errors will return empty list</returns>
        public static async Task<List<string>> ValidateUsername(string username)
        {
            List<string> errors = new List<string>();
            if (username.Length < 4 || username.Length > 15)
            {
                errors.Add("A jelszónak 4 és 15 karakter közöttinek kell lennie");
            }
            if (errors.Count == 0)
            {
                var query = new Dictionary<string, object>();
                query.Add("username", username);
                if (!Boolean.Parse((await Networking.GetRequestSimple("username", query)).Content) == true)
                    errors.Add("A felhasználó név foglalt.");
            }
            return errors;
        }
        
    }
}
