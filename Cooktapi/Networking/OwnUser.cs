using IdentityModel.OidcClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Cooktapi.Networking
{
    public delegate void UserChangedDelegate();
    public class OwnUser : User
    {
        private static string m_AccessToken;
        public string AccessToken
        {
            get
            {
                if (LoginResult == null && m_AccessToken != null)
                    return m_AccessToken;
                return LoginResult?.AccessToken;
            }
            private set
            {
                m_AccessToken = value;
            }
        }
        private static OwnUser m_CurrentUser;
        public static OwnUser CurrentUser
        {
            get
            {
                return m_CurrentUser;
            }
        }
        public string Role { get; private set; }
        public List<string> Permissions { get; private set; }
        internal string Email { get; private set; }
        private static event UserChangedDelegate UserChangedEvent;
        private LoginResult LoginResult { get; set; }
        public bool IsLoggedIn { get; private set; }
        private static async Task<bool> ApplyLogin(LoginResult result)
        {
            if (!result.IsError)
            {
                m_CurrentUser = new OwnUser();
                CurrentUser.LoginResult = result;
                try
                {
                    await RefreshCurrentUserData();
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
        /// <summary>
        /// Uploads the local changes and redownload the complete user profile
        /// </summary>
        internal static async Task RefreshCurrentUserData()
        {
            CurrentUser.IsLoggedIn = CurrentUser.LoginResult != null && !CurrentUser.LoginResult.IsError;
            if (CurrentUser.IsLoggedIn)
            {
                CurrentUser.Sub = GetClaim("sub");
                CurrentUser.ProfilPic = GetClaim("picture");
                CurrentUser.Email = GetClaim("email");

                JObject body = new JObject();
                if (CurrentUser.Email != null)
                    body.Add("email", JToken.FromObject(CurrentUser.Email));
                if (CurrentUser.ProfilPic != null)
                    body.Add("profilpic", JToken.FromObject(CurrentUser.ProfilPic));
                if (CurrentUser.DisplayName != null)
                    body.Add("username", JToken.FromObject(CurrentUser.DisplayName));
                var result = await Networking.PostRequestWithForceAuth("userdata", body.ToString(Formatting.None));
                ApplyJson(result.Content);
                CurrentUser.Permissions = await GetPermissions();
                UserChangedEvent?.Invoke();
            }
        }
        private static async Task<List<string>> GetPermissions()
        {
            List<string> permissions = new List<string>();
            var response = await Networking.GetRequestWithForceAuth("mypermissions", null);
            if (response.Content != null && response.Content != "" && response.StatusCode != System.Net.HttpStatusCode.NotFound)
            {
                JArray jarray = JArray.Parse(response.Content);
                for (int i = 0; i < jarray.Count; i++)
                {
                    permissions.Add(jarray.ElementAt(i).Value<string>());
                }
            }
            return permissions;
        }
        internal static void Clear()
        {
            m_CurrentUser = null;
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
            CurrentUser.DisplayName = infoJObj?.Value<string>("username") ?? CurrentUser.DisplayName;
            CurrentUser.Role = infoJObj?.Value<string>("role") ?? CurrentUser.Role;
            CurrentUser.Email = infoJObj?.Value<string>("email") ?? CurrentUser.Email;
            CurrentUser.ProfilPic = infoJObj?.Value<string>("profilpic") ?? CurrentUser.ProfilPic;
        }
        public static string GetClaim(string type)
        {
            if (CurrentUser.LoginResult != null && !CurrentUser.LoginResult.IsError)
            {
                foreach (Claim cl in CurrentUser.LoginResult?.User?.Claims)
                {
                    if (cl.Type == type)
                    {
                        return cl.Value;
                    }
                }
            }
            return null;
        }
        /// <summary>
        /// Change the users Display name to a random anonim username.
        /// </summary>
        /// <returns></returns>
        public static async Task SetRandomUserName()
        {
            bool userValid = false;
            string username = "notinitialized";
            while (!userValid)
            {
                username = "user" + new Random().Next(99999999);
                userValid = (await ValidateUsername(username)).Count <= 0;
            }
            await ChangeUserName(username);
        }

        /// <summary>
        /// Call this to add method to UserChangedEvent.
        /// </summary>
        /// <param name="action"></param>
        public static void SubscribeFor(Action action)
        {
            UserChangedEvent += () => { action.Invoke(); };
        }
        /// <summary>
        /// Display forms for login the user
        /// </summary>
        /// <returns></returns>
        public static async Task LoginUser()
        {
            var res = await Cookta.DoLogin();
            if (!res.IsError)
                await ApplyLogin(res);
        }
        /// <summary>
        /// Logout the user reset him details
        /// </summary>
        /// <returns></returns>
        public static async Task LogoutUser()
        {
            await Cookta.DoLogout();
            Clear();
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
            if (errors.Count != 0)
                return errors;
            //Update username
            CurrentUser.DisplayName = username;
            await RefreshCurrentUserData();
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
        public static void SetupForTest(string accessToken)
        {
            CurrentUser.ProfilPic = null;
            CurrentUser.Email = "tester@autotester.com";
            CurrentUser.DisplayName = string.Format("ImARobot{0}", new Random().Next(999999999));
        }
    }
}
