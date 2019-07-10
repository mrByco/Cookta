using Kukta.Calendar;
using Kukta.FrameWork;
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
            bool debugServer = true;
            App.RestClient = new RestClient(debugServer ? "http://192.168.1.74:1337/" : "https://kuktaservices.azurewebsites.net/");

            await SetLoading(true);
            await FoodFrameworkV2.Unit.Init();
            await FoodFrameworkV2.IngredientType.Init();
            await SetLoading(false);
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
                    Init();
                }
                return;
            }
            catch
            {
                Init();
            }
        }

        private async void Logout()
        {
            await SetLoading(true);
            await Networking.Logout();
            await SetLoading(false);
        }


        private async Task SetLoading(bool IsLoading)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () => 
            {
                LoginPanel.Visibility = IsLoading ? Visibility.Collapsed : Visibility.Visible;
                LoadRing.Visibility = IsLoading ? Visibility.Visible : Visibility.Collapsed;
            });
            return;
        }

        private void NoLoginBTN_Click(object sender, RoutedEventArgs e)
        {
            App.SwapToRootPage();
        }

        private async void LoginBTNClick(object sender, RoutedEventArgs e)
        {
            await SetLoading(true);
            var res = await Networking.SignUpLogin();
            if (!res.IsError)
            {
                App.SwapToRootPage();
                return;
            }
            await SetLoading(false);
        }
    }
}