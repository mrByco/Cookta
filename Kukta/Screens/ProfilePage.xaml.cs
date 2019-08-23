using Cooktapi.Networking;
using Kukta.UI.Dialogs;
using System;
using System.Collections.Generic;
using System.ComponentModel;
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
    public sealed partial class ProfilePage : Page, INotifyPropertyChanged
    {
        public ProfilePage()
        {
            this.InitializeComponent();
        }

        private User m_LoadedUser;
        public User LoadedUser
        {
            get
            {
                return m_LoadedUser;
            }
            set
            {
                m_LoadedUser = value;
                OnPropertyChanged("LoadedUser");
            }
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
        private async void UpdateData(User newUser)
        {
            LoadedUser = newUser;
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                if (LoadedUser.ProfilPic != null)
                    Picture.ProfilePicture = new BitmapImage(new Uri(LoadedUser.ProfilPic, UriKind.Absolute));
                else if (LoadedUser.DisplayName != "")
                {
                    Picture.DisplayName = LoadedUser.DisplayName;
                }
                var sourceQuery = new Dictionary<string, object>();
                sourceQuery.Add("type", "userfoods");
                sourceQuery.Add("user", LoadedUser.Sub);
                UsersFoods.ItemsSource = new UWPLayer.IncrementalFoodSource(Cooktapi.Food.EFoodSearchType.Custom, sourceQuery, Dispatcher, 0);
                UsersFoods.TitleText = string.Format("{0} receptjei: ", LoadedUser.DisplayName);

                if (LoadedUser is OwnUser ownUser)
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
            });
        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            _ = Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
            });
        }

        private void LogoutBTN_Click(object sender, RoutedEventArgs e)
        {
            App.DoLogout();
        }

        private void ReceiveFreeSubBTN_Click(object sender, RoutedEventArgs e)
        {
            throw new NotImplementedException();
        }

        private void BuySubBTN_Click(object sender, RoutedEventArgs e)
        {

        }

        private void ChangeUserNameBTN_Click(object sender, RoutedEventArgs e)
        {
            App.DoUserRename();
        }

        private void UploadNewFoodButton(object sender, RoutedEventArgs e)
        {
            MainPage.NavigateTo("fooddetail", null, null);
        }

        private void UsersFoods_OnItemClick(Cooktapi.Food.Food food)
        {
            MainPage.NavigateTo("fooddetail", null, food._id);
        }

        private void SendReport_Click(object sender, RoutedEventArgs e)
        {
            _ = new SendReportDialog().ShowAsync();
        }
    }
}
