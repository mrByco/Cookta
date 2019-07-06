using Kukta.FoodFrameworkV2;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
    public sealed partial class HomePage : Page
    {
        public HomePage()
        {
            this.InitializeComponent();
        }

        

        private ObservableCollection<Food> m_foods = new ObservableCollection<Food>();
        public ObservableCollection<Food> Foods
        {
            get
            {
                return m_foods;
            }
        }

        private async void Page_Loaded(object sender, RoutedEventArgs e)
        {
            m_foods = new ObservableCollection<Food>(await Food.GetLastFoods(1, 50));
            DataPanel.ItemsSource = m_foods;

        }

        private void HomeBTN_Click(object sender, RoutedEventArgs e)
        {

        }

        private void NewFoodsBTN_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
