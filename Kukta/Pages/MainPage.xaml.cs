using IdentityModel.OidcClient;
using Kukta.UI;
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
using Cooktapi.Networking;

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
        private readonly List<(string Tag, Type Page, bool setNavNull, string param)> _pages = new List<(string Tag, Type Page, bool setNavNull, string param)>
{
    ("home", typeof(HomePage), false, null),
    ("calendar", typeof(CalendarPage), false, null),
    ("templates", typeof(WeekTemplatePage), false, null),
    ("lists", typeof(FoodCategories), false, null),
    ("foods", typeof(FoodEditor), false, null),
    ("shoppinglist", typeof(ShoppingListPage), false, null),
    ("baselist", typeof(BaselistPage), false, null),
    ("search", typeof(SearchPage), true, null),
    ("stocker", typeof(StockerPage), false, null),
    ("account", typeof(ProfilePage), false, OwnUser.CurrentUser?.Sub),
    ("tageditor", typeof(TagEditorPage), false, null),
    ("roleeditor", typeof(RoleEditorPage), false, null),
    ("pendings", typeof(FoodValidationListPage), false, null),
    ("validate", typeof(FoodValidationPage), true, null),
    ("keymanager", typeof(KeyManagerPage), false, null),
    ("usermanager", typeof(UserManagerPage), false, null),
    ("ingredients", typeof(IngredientPage), false, null),
    ("fooddetail", typeof(FoodDetailPage), true, null),
};

        public MainPage()
        {
            this.InitializeComponent();
            instance = this;
            OwnUser.SubscribeFor(UpdateLoginButton);
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
                var navItemTag = ((NavigationViewItem)args.SelectedItem).Tag.ToString();
                NavView_Navigate(navItemTag, null, null);
            }
        }

        protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            App.ChangeTitleBarColor(Windows.UI.Colors.LightGray);
            List<string> permissions = new List<string>();
            try
            {
                permissions = e.Parameter as List<string>;
                if (permissions == null)
                    throw new Exception();
            }
            catch
            {
                if (OwnUser.CurrentUser.IsLoggedIn)
                {
                    permissions = OwnUser.CurrentUser.Permissions;
                }
            }

            HomeItem.Visibility = Visibility.Visible;
            AccountItem.Visibility = Visibility.Visible;
            FoodsItem.Visibility = Visibility.Visible;
            CalendarItem.Visibility = Visibility.Visible;
            IngredientsItem.Visibility = permissions.Contains("manage-ingredients") ? Visibility.Visible : Visibility.Collapsed;
            TagEditorItem.Visibility = permissions.Contains("manage-tags") ? Visibility.Visible : Visibility.Collapsed;
            RoleEditorItem.Visibility = permissions.Contains("manage-roles") ? Visibility.Visible : Visibility.Collapsed;
            KeyManagerItem.Visibility = permissions.Contains("manage-keys") ? Visibility.Visible : Visibility.Collapsed;
            UserManagerItem.Visibility = permissions.Contains("manage-users") ? Visibility.Visible : Visibility.Collapsed;
        }

        public async void ShowServiceError()
        {
            await NoServicesDialog.ShowAsync();
        }

        private void UpdateLoginButton()
        {
            AccountItem.Content = OwnUser.GetClaim("name")?? "Bejelentkezés";
        }

        public static void NavigateTo(string navItemTag, NavigationTransitionInfo info, object param)
        {
            var openedpopups = VisualTreeHelper.GetOpenPopups(Window.Current);
            foreach (var popup in openedpopups)
            {
                if (popup.Child is ContentDialog dialog)
                {
                    dialog.Hide();
                }
            }
            DoNav.Invoke(navItemTag, param, info);
        }


        private async void NavView_Navigate(string navItemTag, object parameter, NavigationTransitionInfo transitionInfo)
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
                parameter = parameter ?? item.param;
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
                if (ContentFrame.Content is FoodDetailPage detailPage)
                    await detailPage.BeforeNavigatingFrom();
                if (transitionInfo == null)
                    ContentFrame.Navigate(_page, parameter, transitionInfo);
                else
                    ContentFrame.Navigate(_page, parameter, transitionInfo);
            }
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            UpdateLoginButton();
            NavigateTo("home", null, null);
        }
    }
}
