using Cooktapi.Food;
using Cooktapi.Measuring;
using Cooktapi.Networking;
using IdentityModel.OidcClient;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cooktapi
{
    public delegate Task<LoginResult> LoginDelegate();
    public delegate Task LogoutDelegate();
    public delegate void SendNotificationDelegete(string title, string message);
    public class Cookta
    {
        internal static LoginDelegate DoLogin { get; private set; }
        internal static LogoutDelegate DoLogout { get; private set; }
        internal static SendNotificationDelegete SendNotification { get; private set; }
        public Cookta(LoginDelegate doLogin, LogoutDelegate doLogout, SendNotificationDelegete sendNotification, bool debugServer)
        {
            DoLogin = doLogin;
            DoLogout = doLogout;
            SendNotification = sendNotification;

            Networking.Networking.Init(debugServer);
        }
        public static async Task Init()
        {
            await Unit.Init();
            await IngredientType.Init();
        }
        public void InitUserViaToken(string token)
        {
            User.SetupForTest(token);
        }
        public void ResetCurrentUser()
        {
            User.Clear();
            return;
        }

    }
}
