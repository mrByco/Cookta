using Cooktapi.Networking;
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
        /// <summary>
        /// 
        /// </summary>
        /// <param name="e">the parameter is a string, the id of the opening user</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            string id = e.Parameter as string;
            if (id == OwnUser.CurrentUser.Sub)
            {
                UpdateData(OwnUser.CurrentUser);
            }
            else
            {
                Task.Run(() => { LoadUser(id); });
            }
        }
        private async void LoadUser(string id)
        {
            var user = await User.GetUser(id);
            UpdateData(user);
        }
        private async void UpdateData(User user)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                if (user.ProfilPic != null)
                    Picture.ProfilePicture = new BitmapImage(new Uri(user.ProfilPic, UriKind.Absolute));
                else if (user.DisplayName != "")
                {
                    Picture.DisplayName = user.DisplayName;
                }

                NameTextBlock.Text = user.DisplayName ?? "";
                if (user is OwnUser ownUser)
                {
                    if (ownUser.Role == "dev")
                    {
                        SubInfoTextBlock.Text = "Fejlesztő - korlátlan hozzáférés";
                    }
                    else if (ownUser.Role == "owner")
                    {
                        SubInfoTextBlock.Text = "Tulajdonos - korlátlan hozzáférés";
                    }
                    else if (ownUser.Role == "test")
                    {
                        SubInfoTextBlock.Text = "Tesztelő - korlátlan hozzáférés";
                    }
                    else if (ownUser.Role == "gold-test")
                    {
                        SubInfoTextBlock.Text = "Arany tesztelő - korlátlan prémium időtartam.";
                    }
                    else
                    {
                        SubInfoTextBlock.Text = "Nincs érvényes előfizetésed";
                    }
                }
                else
                {
                    LogoutBTN.Visibility = Visibility.Collapsed;
                    ChangeUserNameBTN.Visibility = Visibility.Collapsed;
                }
            });
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
