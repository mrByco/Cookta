using Kukta.FoodFramework;
using System;
using System.Collections.Generic;
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
    public sealed partial class FoodFrame : Page
    {
        public FoodFrame()
        {
            this.InitializeComponent();
        }

        private Food CurrentFood;

        
        
        internal void OpenFood(Food food)
        {
            try
            {
                CurrentFood.OnFoodEdited -= new VoidDelegate(RefreshDetails);
            }
            catch { }
            CurrentFood = food;
            RefreshDetails();
            if (food != null)
                food.OnFoodEdited += new VoidDelegate(RefreshDetails);
        }

        private void RemoveButtonClick(object sender, RoutedEventArgs e)
        {
            FoodDatabase.Instance.RemoveFood(CurrentFood);
            OpenFood(null);
        }

        private void DescLostFocus(object sender, RoutedEventArgs e)
        {
            CurrentFood.Desc = FoodDescription.Text;
        }
        private void TitleLostFocus(object sender, RoutedEventArgs e)
        {
            CurrentFood.Name = FoodName.Text;
        }

        private void RefreshDetails()
        {
            if (CurrentFood == null)
            {
                FoodName.Text = "Open a food";
                FoodName.IsEnabled = false;
                FoodDescription.IsEnabled = false;
                FoodDescription.Text = "Open a food";
                RemoveButton.IsEnabled = false;

            }
            else
            {
                FoodName.Text = CurrentFood.Name;
                FoodName.IsEnabled = CurrentFood.CustomFood;
                FoodDescription.IsEnabled = CurrentFood.CustomFood;
                FoodDescription.Text = CurrentFood.Desc.Replace("\n", "\r\n");
                RemoveButton.IsEnabled = CurrentFood.CustomFood;
            }
        }
    }
}
