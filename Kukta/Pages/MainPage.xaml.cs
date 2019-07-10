﻿using IdentityModel.OidcClient;
using Kukta.FrameWork;
using Kukta.Screens;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Animation;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace Kukta
{
    public delegate void NavigateTo(string tag, object param, NavigationTransitionInfo info);
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public static MainPage instance;
        private static event NavigateTo DoNav;
        

        // List of ValueTuple holding the Navigation Tag and the relative Navigation Page
        private readonly List<(string Tag, Type Page, bool setNavNull)> _pages = new List<(string Tag, Type Page, bool setNavNull)>
{
    ("home", typeof(HomePage), false),
    ("calendar", typeof(CalendarPage), false),
    ("templates", typeof(WeekTemplatePage), false),
    ("categories", typeof(FoodCategories), false),
    ("foods", typeof(FoodEditor), false),
    ("fooddetail", typeof(FoodDetailPage), true),
};

        public MainPage()
        {
            this.InitializeComponent();
            instance = this;
            Networking.LoginChanged += UpdateLoginButton;
            DoNav += new NavigateTo(NavView_Navigate);
        }






        private void ContentFrame_NavigationFailed(object sender, NavigationFailedEventArgs e)
        {

        }

        private void NavView_SelectionChanged(NavigationView sender, NavigationViewSelectionChangedEventArgs args)
        {
            if (args.IsSettingsSelected == true)
            {
                NavView_Navigate("settings", null, null);
            }
            else if ((NavigationViewItem)args.SelectedItem != null)
            {
                if (((NavigationViewItem)args.SelectedItem).Tag.ToString() == "account")
                {
                    //do login
                    if (Networking.aResult != null)
                    {
                        SignInUpProfileDialog.Content = new ProfilePanel(SignInUpProfileDialog.Hide);
                        SignInUpProfileDialog.ShowAsync();
                    }
                    else
                    {
                        Networking.SignUpLogin();
                    }
                }
                else
                {
                    var navItemTag = ((NavigationViewItem)args.SelectedItem).Tag.ToString();
                    NavView_Navigate(navItemTag, null, null);
                }
            }
        }

        public async void ShowServiceError()
        {
            await NoServicesDialog.ShowAsync();
        }

        private void UpdateLoginButton(LoginResult result)
        {
            AccountItem.Content = result == null ? "Bejelentkezés" : Networking.GetClaim("name");
        }

        public static void NavigateTo(string navItemTag, NavigationTransitionInfo info, object param)
        {
            DoNav.Invoke(navItemTag, param, info);
        }


        private void NavView_Navigate(string navItemTag, object parameter, NavigationTransitionInfo transitionInfo)
        {
            Type _page = null;
            if (navItemTag == "settings")
            {
                _page = null;
            }
            else
            {
                var item = _pages.FirstOrDefault(p => p.Tag.Equals(navItemTag));
                _page = item.Page;
                if (item.setNavNull)
                {
                    NavView.SelectedItem = null;
                    NavView.UpdateLayout();
                }
            }
            // Get the page type before navigation so you can prevent duplicate
            // entries in the backstack.
            var preNavPageType = ContentFrame.CurrentSourcePageType;

            // Only navigate if the selected page isn't currently loaded.
            if (!(_page is null) && !Type.Equals(preNavPageType, _page))
            {
                if (transitionInfo == null)
                    ContentFrame.Navigate(_page, parameter, transitionInfo);
                else
                    ContentFrame.Navigate(_page, parameter, transitionInfo);
            }
        }

        private async void Page_Loaded(object sender, RoutedEventArgs e)
        {
            UpdateLoginButton(Networking.aResult);
        }
    }
}