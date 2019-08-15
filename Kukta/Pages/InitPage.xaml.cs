using Cooktapi;
using Cooktapi.Networking;
using Kukta.UI;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class InitPage : Page
    {
        public InitPage()
        {
            this.InitializeComponent();
        }
        public async void Init()
        {
            App.Cookta = new Cooktapi.Cookta(App.SignUpLogin, App.Logout, App.Sendnotification, false);

            await SetLoadingAsync(true);

            await Cookta.Init();

            await SetLoadingAsync(false);
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            App.ChangeTitleBarColor(Windows.UI.Colors.Brown);
            try
            {
                string command = e.Parameter as string;
                if (command == "LOGOUT")
                {
                    Logout();
                }
                else if (command == "RENAME")
                {
                    ChangeName();
                }
                else
                {
                    SwitchToLogin();
                    Init();
                }
                return;
            }
            catch
            {
                SwitchToLogin();
                Init();
            }
        }

        private async void Logout()
        {
            await SetLoadingAsync(true);
            await User.LogoutUser();
            SwitchToLogin();
            await SetLoadingAsync(false);
        }
        private async void ChangeName()
        {
            await SetLoadingAsync(true);
            await Task.Delay(1000);
            SwitchToUserData();
            await SetLoadingAsync(false);
        }


        private async Task SetLoadingAsync(bool IsLoading)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () =>
            {
                ContentFrame.Visibility = IsLoading ? Visibility.Collapsed : Visibility.Visible;
                LoadRing.Visibility = IsLoading ? Visibility.Visible : Visibility.Collapsed;
            });
            return;
        }
        private void SetLoading(bool IsLoading)
        {
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
            Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () =>
            {
                ContentFrame.Visibility = IsLoading ? Visibility.Collapsed : Visibility.Visible;
                LoadRing.Visibility = IsLoading ? Visibility.Visible : Visibility.Collapsed;
            });
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
        }
        public void SwitchToLogin()
        {
            ContentFrame.Navigate(typeof(LoginPanel), null);
            (ContentFrame.Content as LoginPanel).SetLoading += SetLoading;
            (ContentFrame.Content as LoginPanel).parent = this;
        }
        public void SwitchToUserData()
        {
            ContentFrame.Navigate(typeof(UserDataPanel), null);
            (ContentFrame.Content as UserDataPanel).SetLoading += SetLoading;
        }
        public string VersionName
        {
            get
            {
                return string.Format("v{0}b", App.GetAppVersion());
            }
        }
    }
}