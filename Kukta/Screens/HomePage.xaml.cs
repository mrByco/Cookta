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



        public IncrementalFoodSource Foods;

        private async void Page_Loaded(object sender, RoutedEventArgs e)
        {
            //Foods = new IncrementalFoodSource(EFoodSearchType.All, new Dictionary<string, object>(), Dispatcher, 0);
            //FoodPanel.ItemsSource = Foods;
        }

        private void HomeBTN_Click(object sender, RoutedEventArgs e)
        {

        }

        private void NewFoodsBTN_Click(object sender, RoutedEventArgs e)
        {

        }

        private void DataPanel_ItemClick(object sender, ItemClickEventArgs e)
        {
            string clickedID = (e.ClickedItem as Food)._id;
            MainPage.NavigateTo("fooddetail", null, clickedID);
        }

        private void Searchbox_QuerySubmitted(AutoSuggestBox sender, AutoSuggestBoxQuerySubmittedEventArgs args)
        {
            string query = args.QueryText;
            MainPage.NavigateTo("search", null, new SearchParam(query, new List<Tag>()));
        }

        private void FoodPanel_OnItemClick(Food food)
        {
            MainPage.NavigateTo("fooddetail", null, food._id);
        }
    }
}
