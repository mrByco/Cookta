using Kukta.Calendar;
using Kukta.UI;
using Kukta.Menu;
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
using Kukta.FrameWork;

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
            bool debugServer = false;
            App.RestClient = new RestClient(debugServer ? "http://localhost:1337/" : "https://kuktaservices.azurewebsites.net/");

            await SetLoadingAsync(true);
            await FoodFrameworkV2.Unit.Init();
            await FoodFrameworkV2.IngredientType.Init();
            await SetLoadingAsync(false);
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            try
            {
                string command = e.Parameter as string;
                if (command == "LOGOUT")
                {
                    Logout();
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
            await Networking.Logout();
            SwitchToLogin();
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
        }
        public void SwitchToUserData()
        {

        }
    }
}