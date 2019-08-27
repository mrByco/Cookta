using Cooktapi.Networking;
using Kukta.UWPLayer;
using System;
using System.Collections.Generic;
using System.ComponentModel;
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
using Windows.UI.Xaml.Navigation;

// The Content Dialog item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.UI.Dialogs
{
    public sealed partial class NotificationsDialog : ContentDialog, INotifyPropertyChanged
    {
        public NotificationsDialog()
        {
            this.InitializeComponent();
        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string name)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
        private IncrementalNotificationSource m_Source;
        public IncrementalNotificationSource Source
        {
            get => m_Source;
            set
            {
                m_Source = value;
                OnPropertyChanged("Source");
            }
        }

        private void ContentDialog_Loaded(object sender, RoutedEventArgs e)
        {
            Source = new IncrementalNotificationSource(Dispatcher);
        }

        private void ArhiveButton_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button)
            {
                _ = NotificationManager.ArhiveNotification(button.Tag as string);
                Source.SetItemArhived(button.Tag as string);
            }
        }

        private void ShowArhives_Changed(object sender, RoutedEventArgs e)
        {
            Source.AllowArhived = (bool)(ShowArhivesCheckBox.IsChecked ?? false);
        }
    }
}
