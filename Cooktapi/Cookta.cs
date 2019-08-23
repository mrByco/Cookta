using Cooktapi.Food;
using Cooktapi.Measuring;
using Cooktapi.Networking;
using IdentityModel.OidcClient;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;

namespace Cooktapi
{
    public delegate Task<LoginResult> LoginDelegate();
    public delegate Task LogoutDelegate();
    public delegate void RunOnUIThreadAsyncDelegate(Action action);
    public delegate void SendNotificationDelegete(string title, string message);
    public class Cookta : INotifyPropertyChanged
    {
        internal static LoginDelegate DoLogin { get; private set; }
        internal static LogoutDelegate DoLogout { get; private set; }
        internal static SendNotificationDelegete SendNotification { get; private set; }
        public static event PropertyChangedEventHandler StaticPropertyChanged;

        private string m_LoadingState = "Nincs csatlakozva";
        public string LoadingState
        {
            get
            {
                return m_LoadingState;
            }
            set
            {
                m_LoadingState = value;
                OnProperyChanged("LoadingState");
            }
        }
        private bool m_Connected = false;
        public bool Connected
        {
            get
            {
                return m_Connected;
            }
            set
            {
                m_Connected = value;
                OnProperyChanged("Connected");
            }
        }

        public Cookta(LoginDelegate doLogin, LogoutDelegate doLogout, SendNotificationDelegete sendNotification)
        {
            DoLogin = doLogin;
            DoLogout = doLogout;
            SendNotification = sendNotification;

        }
        public event PropertyChangedEventHandler PropertyChanged;
        private void OnProperyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        public async Task Init(ServerOption server, RunOnUIThreadAsyncDelegate RunOnUIThread)
        {
            RunOnUIThread(() => { Connected = false; });
            Networking.Networking.Init(server);
            try
            {
                RunOnUIThread(() => { LoadingState = "Mértékegységek betöltése"; });
                await Unit.Init();
                RunOnUIThread(() => { LoadingState = "Cimkék betöltése"; });
                await Tag.DownloadTags();
                RunOnUIThread(() => { LoadingState = "Hozzávalók betöltése"; });
                await IngredientType.Init();
                RunOnUIThread(() => { LoadingState = "Csatlakozva"; });
                RunOnUIThread(() => { Connected = true; });

            }
            catch
            {
                RunOnUIThread(() => { Connected = false; });
                RunOnUIThread(() => { LoadingState = "Ismeretlen hiba csatlakozás közben, ellenőrizd az internetkapcsolatod."; });
                
            }
        }
        public void InitUserViaToken(string token)
        {
            OwnUser.SetupForTest(token);
        }
        public void ResetCurrentUser()
        {
            OwnUser.Clear();
            return;
        }

    }
    public class ServerOption
    {
        public string ip;
        public string name;
        public override string ToString()
        {
            return name;
        }
        public static List<ServerOption> GetOptions()
        {
            var serverOptions = new List<ServerOption>();
            serverOptions.Add(new ServerOption() { ip = "https://kuktaservices.azurewebsites.net/", name = "Éles cookta szerver" });
            serverOptions.Add(new ServerOption() { ip = "http://localhost:1337/", name = "Debug (nem ajánlott)" });
            return serverOptions;
        }
    }
}
