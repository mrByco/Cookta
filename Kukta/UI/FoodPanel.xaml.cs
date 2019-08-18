using Cooktapi.Food;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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

// The User Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234236

namespace Kukta.UI
{
    public sealed partial class FoodPanel : UserControl, INotifyPropertyChanged
    {

        public FoodPanel()
        {
            this.InitializeComponent();
        }
        public readonly ObservableCollection<Food> m_Items = new ObservableCollection<Food>();

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        public void SetItems()
        {

        }
    }
    internal enum EFoodPanelMode
    {
        Compact,
        List,
    }
    internal enum EFoodPanelSideDirection
    {
        Vertical,
        Horizontal,
    }
}
