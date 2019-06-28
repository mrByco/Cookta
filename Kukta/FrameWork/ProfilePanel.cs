using IdentityModel.OidcClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml.Controls;

namespace Kukta.FrameWork
{
    class ProfilePanel : StackPanel
    {

        public ProfilePanel()
        {
            RefreshPanel();
        }

        public async void RefreshPanel()
        {
            LoginResult result = Networking.aResult;
            UpdateUI(result);
        }

        private async void UpdateUI(LoginResult result)
        {
            Children.Clear();
            //Draw layout
            string userName = Networking.GetClaim("name");
            TextBlock NameTextBlock = new TextBlock()
            {
                Text = userName,
            };
            Button LogoutBTN = new Button()
            {
                Content = "Kijelentkezés",
            };
            LogoutBTN.Click += Networking.Logout;
            Children.Add(NameTextBlock);
            Children.Add(LogoutBTN);
        }
    }
}
