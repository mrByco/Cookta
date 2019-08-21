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
    public sealed partial class RoleEditorPage : Page, INotifyPropertyChanged
    {
        
        public RoleEditorPage()
        {
            this.InitializeComponent();
        }
        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
        private string m_EditingRoleName;
        public string EditingRoleName
        {
            get
            {
                return m_EditingRoleName;
            }
            set
            {
                m_EditingRoleName = value;
                OnPropertyChanged("EditingRoleName");
            }
        }

        private string m_EditingRoleID;
        public string EditingRoleID
        {
            get
            {
                return m_EditingRoleID;
            }
            set
            {
                m_EditingRoleID = value;
                OnPropertyChanged("EditingRoleID");
            }
        }

        private List<string> m_EditingRolePermissions;
        public List<string> EditingRolePermissions
        {
            get
            {
                return m_EditingRolePermissions;
            }
            set
            {
                m_EditingRolePermissions = value;
                OnPropertyChanged("EditingRolePermissionsString");
            }
        }
        public string EditingRolePermissionsString
        {
            get
            {
                string str = "";
                m_EditingRolePermissions?.ForEach(perm => { if (str.Length > 0) str = str + "\r";  str = str + perm; });
                return str;
            }
            set
            {
                m_EditingRolePermissions = value.Split("\r").ToList();
                OnPropertyChanged("EditingRolePermissionsString");
            }
        }


        private void AddNewItem_Click(object sender, RoutedEventArgs e)
        {
            RoleIDTextBox.IsEnabled = true;
            EditingRoleID = "";
            EditingRoleName = "";
            EditingRolePermissions = new List<string>();
            RoleEditContentDialog.ShowAsync();
        }

        private void OpenItemForEdit(object sender, ItemClickEventArgs e)
        {
            Role clicked = e.ClickedItem as Role;
            RoleIDTextBox.IsEnabled = false;
            EditingRoleID = clicked.roleID;
            EditingRoleName = clicked.displayName;
            EditingRolePermissions = clicked.permissions;
            RoleEditContentDialog.ShowAsync();
        }
        private async void SaveItemClick(object sender, RoutedEventArgs e)
        {
            if (EditingRoleName.Length > 0 && EditingRoleID.Length > 0)
            {
                await Role.UpdateRole(new Role() { displayName = EditingRoleName, roleID = EditingRoleID, permissions = EditingRolePermissions });
                ReloadRoles();
            }
            RoleEditContentDialog.Hide();
        }
        private ObservableCollection<Role> m_roles = new ObservableCollection<Role>();
        public ObservableCollection<Role> Roles
        {
            get
            {
                return m_roles;
            }
            set
            {
                m_roles = value;
                OnPropertyChanged("Roles");
            }
        }

        private async Task ReloadRoles()
        {
            Roles = new ObservableCollection<Role>(await Role.GetRoles());
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            ReloadRoles();
        }
    }
}
