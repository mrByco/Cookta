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
    public sealed partial class KeyManagerPage : Page, INotifyPropertyChanged
    {
        public KeyManagerPage()
        {
            this.InitializeComponent();
        }
        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
        private int m_GeneratingCount;
        public int GeneratingCount
        {
            get
            {
                return m_GeneratingCount;
            }
            set
            {
                m_GeneratingCount = value;
                OnPropertyChanged("GeneratingCount");
            }
        }
        private string m_GeneratingType;
        public string GeneratingType
        {
            get
            {
                return m_GeneratingType;
            }
            set
            {
                m_GeneratingType = value;
                OnPropertyChanged("GeneratingType");
            }
        }
        private int m_Maxusings;
        public int Maxusings
        {
            get
            {
                return m_Maxusings;
            }
            set
            {
                m_Maxusings = value;
                OnPropertyChanged("Maxusings");
            }
        }
        private void GenerateItems_Click(object sender, RoutedEventArgs e)
        {
            GeneratingType = "";
            GeneratingCount = 1;
            Maxusings = 1;
            _ = CodeGenerationDialog.ShowAsync();
        }
        private async void DoGenerationClick(object sender, RoutedEventArgs e)
        {
            await Key.GenerateKeys(GeneratingType, new Newtonsoft.Json.Linq.JObject(), GeneratingCount, Maxusings);
            ReloadKeys();
        }
        private ObservableCollection<Key> m_roles = new ObservableCollection<Key>();
        public ObservableCollection<Key> Keys
        {
            get
            {
                return m_roles;
            }
            set
            {
                m_roles = value;
                OnPropertyChanged("Keys");
            }
        }

        private async Task ReloadKeys()
        {
            Keys = new ObservableCollection<Key>(await Key.GetKeys());
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            ReloadKeys();
        }

        private async void InvalidateSelected_Click(object sender, RoutedEventArgs e)
        {
            List<Key> selected = new List<Key>();
            foreach (object obj in KeyListView.SelectedItems)
            {
                Key key = obj as Key;
                await Key.InvalidateKey(key?.key);
            }
            KeyListView.SelectedItems.Clear(); 
            ReloadKeys();
        }
    }
}
