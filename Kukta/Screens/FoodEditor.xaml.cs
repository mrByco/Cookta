using Kukta.FoodFrameworkV2;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Core;
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
    public sealed partial class FoodEditor : Page
    {
        //
        public FoodEditor()
        {
            this.InitializeComponent();
        }
        private Visibility ContentVisibility;
        private Visibility LoadingVisibibity;

        private ObservableCollection<Food> FilteredMyFoods = new ObservableCollection<Food>();
        private ObservableCollection<Food> FilteredSubcribtedFoods = new ObservableCollection<Food>();

        private List<Food> MyFoods = new List<Food>();
        private List<Food> SubcribtedFoods = new List<Food>();


        private void SearchTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            FilterUpdateUI();
        }


        private async void AddFoodButton_Click(object sender, RoutedEventArgs e)
        {
            MainPage.NavigateTo("fooddetail", null, null);
        }

        private async void Page_Loaded(object sender, RoutedEventArgs e)
        {
            await DownloadFoods();
        }

        private async Task DownloadFoods()
        {
            await SetLoading(true);
            MyFoods = await Food.GetMyFoods();
            SubcribtedFoods = await Food.GetSubFoods();
            FilterUpdateUI();
            await SetLoading(true);
        }

        private void FilterUpdateUI()
        {
            string filter = SearchTextBox.Text;
            FilteredMyFoods = new ObservableCollection<Food>(MyFoods.FindAll((food) => { return food.name.ToLower().Contains(filter.ToLower()); }));
            FilteredSubcribtedFoods = new ObservableCollection<Food>(SubcribtedFoods.FindAll((food) => { return food.name.ToLower().Contains(filter.ToLower()); }));
            MyFoodsListView.ItemsSource = FilteredMyFoods;
            SubFoodsListView.ItemsSource = FilteredSubcribtedFoods;
        }

        private async Task SetLoading(bool isLoading)
        {
            await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
            {
                ContentVisibility = isLoading ? Visibility.Collapsed : Visibility.Visible;
                LoadingVisibibity = isLoading ? Visibility.Visible : Visibility.Collapsed;
            });
            return;
        }

        private void FoodClick(object sender, ItemClickEventArgs e)
        {
            Food clickedFood = e.ClickedItem as Food;
            MainPage.NavigateTo("fooddetail", null, clickedFood._id);
            return;
        }
    }
}
