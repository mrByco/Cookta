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

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class FoodValidationListPage : Page, INotifyPropertyChanged
    {
        public FoodValidationListPage()
        {
            this.InitializeComponent();
        }
        private IncrementalFoodSource m_Source;

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string name)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }

        public IncrementalFoodSource Source
        {
            get
            {
                return m_Source;
            }
            set
            {
                m_Source = value;
                OnPropertyChanged("Source");
            }
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            var args = new Dictionary<string, object>();
            args.Add("type", "pending");
            Source = new IncrementalFoodSource(Cooktapi.Food.EFoodSearchType.Custom, args, Dispatcher, 0);
        }

        private void FoodPanel_OnItemClick(Cooktapi.Food.Food food)
        {
            MainPage.NavigateTo("validate", null, food.Id);
        }
    }
}
