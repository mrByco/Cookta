﻿using Cooktapi.Networking;
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
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class ProfilePage : Page
    {
        public ProfilePage()
        {
            this.InitializeComponent();
        }
        private async void Page_Loaded(object sender, RoutedEventArgs e)
        {
            if (User.IsLoggedIn)
                await User.LoginUser();
            UpdateData();
        }
        private void UpdateData()
        {
            if (User.IsLoggedIn && User.ProfilPic != null)
                Picture.ProfilePicture = new BitmapImage(new Uri(User.ProfilPic, UriKind.Absolute));
            else if (User.DisplayName != "")
            {
                Picture.DisplayName = User.DisplayName;
            }

            NameTextBlock.Text = User.DisplayName ?? "";
            if (User.Role == "dev")
            {
                SubInfoTextBlock.Text = "Fejlesztő - korlátlan hozzáférés";
            }
            else if (User.Role == "owner")
            {
                SubInfoTextBlock.Text = "Tulajdonos - korlátlan hozzáférés";
            }
            else if (User.Role == "test")
            {
                SubInfoTextBlock.Text = "Tesztelő - korlátlan hozzáférés";
            }
            else if (User.Role == "gold-test")
            {
                SubInfoTextBlock.Text = "Arany tesztelő - korlátlan prémium időtartam.";
            }
            else
            {
                SubInfoTextBlock.Text = "Nincs érvényes előfizetésed";
            }
        }

        private void LogoutBTN_Click(object sender, RoutedEventArgs e)
        {
            App.DoLogout();
        }

        private void ReceiveFreeSubBTN_Click(object sender, RoutedEventArgs e)
        {

        }

        private void BuySubBTN_Click(object sender, RoutedEventArgs e)
        {

        }

        private void ChangeUserNameBTN_Click(object sender, RoutedEventArgs e)
        {
            App.DoUserRename();
        }
    }
}
