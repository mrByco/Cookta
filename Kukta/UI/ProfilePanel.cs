﻿using IdentityModel.OidcClient;
using Kukta.FrameWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace Kukta.UI
{
    class ProfilePanel : StackPanel
    {
        private Action ClosePopupp;
        public ProfilePanel(Action closePopupp)
        {
            ClosePopupp = closePopupp;
            RefreshPanel();
        }

        public void RefreshPanel()
        {
            LoginResult result = Networking.aResult;
            UpdateUI(result);
        }

        private void UpdateUI(LoginResult resultm)
        {
            Children.Clear();
            //Draw layout
            string userName = Networking.info?.DisplayName?? Networking.GetClaim("name");
            TextBlock NameTextBlock = new TextBlock()
            {
                Text = userName,
            };
            Button LogoutBTN = new Button()
            {
                Content = "Kijelentkezés",
            };
            LogoutBTN.Click += Logout;
            Children.Add(NameTextBlock);
            Children.Add(LogoutBTN);
        }

        private void Logout(object sender, RoutedEventArgs e)
        {
            ClosePopupp?.Invoke();
            App.DoLogout();
        }
    }
}