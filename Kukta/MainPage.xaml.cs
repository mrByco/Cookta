using Kukta.Screens;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
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
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        // List of ValueTuple holding the Navigation Tag and the relative Navigation Page
        private readonly List<(string Tag, Type Page)> _pages = new List<(string Tag, Type Page)>
{
    ("home", typeof(CalendarPage)),
    ("calendar", typeof(CalendarPage)),
    ("templates", typeof(WeekTemplatePage)),
    ("categories", typeof(FoodCategories)),
    ("foods", typeof(FoodEditor)),
};

        public MainPage()
        {
            this.InitializeComponent();
            //SetContent(ContentType.CategorieEditor);
        }





        private IAccount GetAccountByPolicy(IEnumerable<IAccount> accounts, string policy)
        {
            foreach (var account in accounts)
            {
                string userIdentifier = account.HomeAccountId.ObjectId.Split('.')[0];
                if (userIdentifier.EndsWith(policy.ToLower())) return account;
            }

            return null;
        }

        private void ContentFrame_NavigationFailed(object sender, NavigationFailedEventArgs e)
        {

        }

        private void NavView_SelectionChanged(NavigationView sender, NavigationViewSelectionChangedEventArgs args)
        {
            if (args.IsSettingsSelected == true)
            {
                NavView_Navigate("settings", null);
            }
            else if ((NavigationViewItem)args.SelectedItem != null)
            {
                if (((NavigationViewItem)args.SelectedItem).Tag.ToString() == "account")
                {
                    ShowAccountSignIn();
                }
                else
                {
                    var navItemTag = ((NavigationViewItem)args.SelectedItem).Tag.ToString();
                    NavView_Navigate(navItemTag, null);
                }
            }
        }

        private async void ShowAccountSignIn()
        {

            AuthenticationResult authResult = null;
            IEnumerable<IAccount> accounts = await App.PublicClientApp.GetAccountsAsync();
            try
            {

                authResult = await App.PublicClientApp.AcquireTokenSilentAsync(App.ApiScopes, GetAccountByPolicy(accounts, App.PolicySignUpSignIn), App.Authority, true);
                UpdateSignInState(authResult);
                CallApiButton_Click();
            }
            catch (MsalUiRequiredException ex)
            {
                authResult = await App.PublicClientApp.AcquireTokenAsync(App.ApiScopes, GetAccountByPolicy(accounts, App.PolicySignUpSignIn), UIBehavior.SelectAccount, App.Authority);
                
                UpdateSignInState(authResult);
            }
        }

        private async void ShowAccountDialogAsync()
        {

        }



        private void UpdateSignInState(AuthenticationResult authResult)
        {
            if (authResult?.AccessToken != null)
            {
                AccountItem.Content = GetClaims(authResult.AccessToken).FirstOrDefault((c) => { return c.Type == "name"; }).Value;
            }
            else
            {
                AccountItem.Content = "Bejelentkezés";
            }
        }

        private void NavView_Navigate(string navItemTag, NavigationTransitionInfo transitionInfo)
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
            }
            // Get the page type before navigation so you can prevent duplicate
            // entries in the backstack.
            var preNavPageType = ContentFrame.CurrentSourcePageType;

            // Only navigate if the selected page isn't currently loaded.
            if (!(_page is null) && !Type.Equals(preNavPageType, _page))
            {
                if (transitionInfo == null)
                    ContentFrame.Navigate(_page, null, transitionInfo);
                else
                    ContentFrame.Navigate(_page, null, transitionInfo);
            }
        }

        private async void Page_Loaded(object sender, RoutedEventArgs e)
        {

            try
            {
                IEnumerable<IAccount> accounts = await App.PublicClientApp.GetAccountsAsync();

                AuthenticationResult authResult = await App.PublicClientApp.AcquireTokenSilentAsync(App.ApiScopes, GetAccountByPolicy(accounts, App.PolicySignUpSignIn), App.Authority, true);

                UpdateSignInState(authResult);
            }
            catch (MsalUiRequiredException ex)
            {
                // Ignore, user will need to sign in interactively.
                UpdateSignInState(null);
                //Un-comment for debugging purposes
                //ResultText.Text = $"Error Acquiring Token Silently:{Environment.NewLine}{ex}";
            }
            catch (Exception ex)
            {
            }
        }
        public static IEnumerable<Claim> GetClaims(string token)
        {
            var t = new JwtSecurityToken(token);

            return t.Claims;
        }
        private async void CallApiButton_Click()
        {
            AuthenticationResult authResult = null;
            IEnumerable<IAccount> accounts = await App.PublicClientApp.GetAccountsAsync();
            try
            {
                authResult = await App.PublicClientApp.AcquireTokenSilentAsync(App.ApiScopes, GetAccountByPolicy(accounts, App.PolicySignUpSignIn), App.Authority, false);
            }
            catch (MsalUiRequiredException ex)
            {
                // A MsalUiRequiredException happened on AcquireTokenSilentAsync. This indicates you need to call AcquireTokenAsync to acquire a token


                try
                {
                    authResult = await App.PublicClientApp.AcquireTokenAsync(App.ApiScopes, GetAccountByPolicy(accounts, App.PolicySignUpSignIn));
                }
                catch (MsalException msalex)
                {
                }
            }
            catch (Exception ex)
            {
                return;
            }

            if (authResult != null)
            {
                string u = await GetHttpContentWithToken("https://kuktaservice.azurewebsites.net/api/values", authResult.AccessToken);

            }
        }

        /// <summary>
        /// Perform an HTTP GET request to a URL using an HTTP Authorization header
        /// </summary>
        /// <param name="url">The URL</param>
        /// <param name="token">The token</param>
        /// <returns>String containing the results of the GET operation</returns>
        public async Task<string> GetHttpContentWithToken(string url, string token)
        {
            var httpClient = new HttpClient();
            HttpResponseMessage response;
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                response = await httpClient.SendAsync(request);
                var content = await response.Content.ReadAsStringAsync();
                return content;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

        }
    }
}
