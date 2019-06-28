using Kukta.FoodFrameworkV2;
using Kukta.FrameWork;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
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
        private FoodFrame FoodContent;

        public FoodEditor()
        {
            this.InitializeComponent();
            RefreshList();
        }

        private void SearchTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            RefreshList();
        }

        internal async void RefreshList()
        {
            List<Food> foods = await Food.GetMyFoods();
            await Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
            {
                FoodList.Children.Clear();

                if (SearchTextBox.Text != "")
                {
                    foods = foods.FindAll((food) => food.name.ToUpper().Contains(SearchTextBox.Text.ToUpper()));
                }
                foods.ForEach((food) => AddFood(food));
            });
        }

        private void AddFood(Food food)
        {
            FoodList.Children.Add(new LargeFoodButton((id) => { MainPage.NavigateTo("fooddetail", null, id); }, food));
        }

        private async void AddFoodButton_Click(object sender, RoutedEventArgs e)
        {
            MainPage.NavigateTo("fooddetail", null, null);
            /*FoodNameText.Text = "";
            await AddFoodDialog.ShowAsync();*/
        }

        private void ApplyFoodClick(ContentDialog sender, ContentDialogButtonClickEventArgs args)
        {
            throw new NotImplementedException();
        }

        private void RefreshApplyButtonEnabled()
        {
            bool enabled = false;
            if (FoodNameText.Text != "")
            {
                enabled = true;
            }
            AddFoodDialog.IsPrimaryButtonEnabled = enabled;
        }

        private void AddFoodDialog_SecondaryButtonClick(ContentDialog sender, ContentDialogButtonClickEventArgs args)
        {
            AddFoodDialog.Hide();
        }

        private void FoodNameText_TextChanged(object sender, TextChangedEventArgs e)
        {
            RefreshApplyButtonEnabled();
        }

        private void OpenFoodOnContentViewer(Food food)
        {
            throw new NotImplementedException();
        }
    }
}
