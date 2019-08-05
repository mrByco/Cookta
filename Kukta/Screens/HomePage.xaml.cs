using Cooktapi.Food;
using Kukta.UWPLayer;
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

        

        private ObservableCollection<UFood> m_foods = new ObservableCollection<UFood>();
        private List<Food> OriginalFoods = new List<Food>();
        public ObservableCollection<UFood> Foods
        {
            get
            {
                return m_foods;
            }
        }

        private async void Page_Loaded(object sender, RoutedEventArgs e)
        {
            OriginalFoods = await Food.GetLastFoods(1, 50);
            m_foods = new ObservableCollection<UFood>(UFood.FromList(OriginalFoods));
            DataPanel.ItemsSource = m_foods;

        }

        private void HomeBTN_Click(object sender, RoutedEventArgs e)
        {

        }

        private void NewFoodsBTN_Click(object sender, RoutedEventArgs e)
        {

        }

        private void DataPanel_ItemClick(object sender, ItemClickEventArgs e)
        {
            string clickedID = (e.ClickedItem as UFood)._id;
            MainPage.NavigateTo("fooddetail", null, clickedID);
        }

        private void Searchbox_QuerySubmitted(AutoSuggestBox sender, AutoSuggestBoxQuerySubmittedEventArgs args)
        {

            m_foods = new ObservableCollection<UFood>(UFood.FromList(OriginalFoods.FindAll((food) => { return food.name.ToLower().Contains(sender.Text.ToLower()); })));
            DataPanel.ItemsSource = m_foods;
        }
    }
}
