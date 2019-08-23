using Cooktapi.Networking;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class UserManagerPage : Page, INotifyPropertyChanged
    {
        public UserManagerPage()
        {
            this.InitializeComponent();
        }
        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
        private ExpandedUser m_CurrentUser;
        public ExpandedUser CurrentUser
        {
            get
            {
                return m_CurrentUser;
            }
            set
            {
                m_CurrentUser = value;
                OnPropertyChanged("CurrentUser");
            }
        }
        private ObservableCollection<Role> m_AvailableRoles;
        public ObservableCollection<Role> AvailableRoles
        {
            get
            {
                return m_AvailableRoles;
            }
            set
            {
                m_AvailableRoles = value;
                OnPropertyChanged("AvailableRoles");
            }
        }
        private ObservableCollection<ExpandedUser> m_Users = new ObservableCollection<ExpandedUser>();
        public ObservableCollection<ExpandedUser> Users
        {
            get
            {
                return m_Users;
            }
            set
            {
                m_Users = value;
                OnPropertyChanged("Users");
            }
        }

        private Role m_SelectedRole;
        public Role SelectedRole
        {
            get
            {
                return m_SelectedRole;
            }
            set
            {
                m_SelectedRole = value;
                OnPropertyChanged("SelectedRole");
            }
        }


        private async Task ReloadData()
        {
                Users = new ObservableCollection<ExpandedUser>(await ExpandedUser.GetUsers());
            AvailableRoles = new ObservableCollection<Role>(await Role.GetRoles());
        }

        private void EditUserRole_Click(object sender, RoutedEventArgs e)
        {
            SelectedRole = AvailableRoles.ToList().Find(role => { return role.roleID == CurrentUser.role; });
            _ = SetUserRoleDialog.ShowAsync();
        }
        private async void ChangeRole_ClickAsync(object sender, RoutedEventArgs e)
        {
            SetUserRoleDialog.Hide();
            await ExpandedUser.ChangeUserRole(CurrentUser.sub, SelectedRole);
            ReloadData();
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            ReloadData();
        }

        private void UsersListView_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            CurrentUser = UsersListView.SelectedItem as ExpandedUser;
        }

        private void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            SelectedRole = (sender as ComboBox).SelectedItem as Role;
        }
    }
}
