using Cooktapi.Networking;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
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

namespace Kukta.UI
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class LoginPanel : Page
    {
        public LoginPanel()
        {
            this.InitializeComponent();
        }

        public Action<bool> SetLoading;
        public InitPage parent;

        private void NoLoginBTN_Click(object sender, RoutedEventArgs e)
        {
            App.SwitchToMainPage(new List<string>());
        }

        private async void LoginBTNClick(object sender, RoutedEventArgs e)
        {
            SetLoading?.Invoke(true);
            await OwnUser.LoginUser();
            //if (!res.IsError)
            //{
            //    try
            //    {
            //        if (Networking.info?.DisplayName == null || Networking.info?.DisplayName == "")
            //        {
            //            SetLoading?.Invoke(false);
            //            parent.SwitchToUserData();
            //        }
            //        else
            //        {
            //            await Networking.ChangeUserInfo(null, null, null, Networking.GetClaim("email"), Networking.GetClaim("picture"));
            //            var permissions = await Role.GetPermissions();
            //            App.SwitchToMainPage(permissions);
            //        }
            //    }
            //    catch
            //    {
            //        App.SwitchToMainPage(null);
            //    }
            //    return;
            //}
            if (OwnUser.CurrentUser?.IsLoggedIn ?? false)
            {
                if (OwnUser.CurrentUser.DisplayName == null || OwnUser.CurrentUser.DisplayName == "")
                {
                    parent.SwitchToUserData();
                }
                else
                {
                    App.SwitchToMainPage(OwnUser.CurrentUser.Permissions);
                }
            }
            SetLoading?.Invoke(false);
        }
    }
}
