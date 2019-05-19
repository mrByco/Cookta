using Kukta.FoodFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace Kukta.FrameWork
{
    class FoodCategorieButton : Grid
    {
        private FoodCategory category;
        private Action<FoodCategory> onClick;

        private Button MainButton;
        private Button DeleteButton;
        public FoodCategorieButton(FoodCategory category, Action<FoodCategory> onClick) : base()
        {
            MainButton = new Button();
            DeleteButton = new Button();
            
            ColumnDefinition row1 = new ColumnDefinition();
            row1.Width = new GridLength(1, GridUnitType.Star);
            ColumnDefinition row2 = new ColumnDefinition();
            row2.Width = new GridLength(0, GridUnitType.Auto);

            base.ColumnDefinitions.Add(row1);
            base.ColumnDefinitions.Add(row2);
            
            base.Margin = new Thickness(0, 3, 0, 3);

            MainButton.Content = category.CategoryName;
            MainButton.Click += SelectClick;
            MainButton.HorizontalAlignment = Windows.UI.Xaml.HorizontalAlignment.Stretch;
            MainButton.HorizontalContentAlignment = Windows.UI.Xaml.HorizontalAlignment.Left;
            MainButton.VerticalAlignment = VerticalAlignment.Stretch;
            base.Children.Add(MainButton);
            Grid.SetColumn(MainButton, 0);

            DeleteButton.Content = "-";
            DeleteButton.FontStyle = Windows.UI.Text.FontStyle.Oblique;
            DeleteButton.FontSize = 26;
            DeleteButton.Click += DeleteClick;
            DeleteButton.HorizontalAlignment = Windows.UI.Xaml.HorizontalAlignment.Stretch;
            DeleteButton.HorizontalContentAlignment = Windows.UI.Xaml.HorizontalAlignment.Left;
            base.Children.Add(DeleteButton);
            Grid.SetColumn(DeleteButton, 1);
            
            this.category = category;
            this.onClick = onClick;
        }
        public void SelectClick(object sender, RoutedEventArgs e)
        {
            onClick(category);
        }
        public void DeleteClick(object sender, RoutedEventArgs e)
        {
            FoodDatabase.Instance.DeleteCategory(category);
        }
}
}
