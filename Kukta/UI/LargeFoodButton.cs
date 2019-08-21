using Cooktapi.Food;
using Kukta.Converters;
using Kukta.UWPLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;

namespace Kukta.UI
{
    class LargeFoodButton : Button
    {
        private Image image;
        private TextBlock title;
        private TextBlock desc;
        private string foodID;
        private Action<string> OnClick;

        private Grid root;
        private StackPanel ver;

        public LargeFoodButton(Action<string> onClick, Food food)
        {
            root = new Grid()
            {
                HorizontalAlignment = HorizontalAlignment.Stretch,
                Background = new SolidColorBrush(Windows.UI.Color.FromArgb((byte) 100, (byte)0, (byte)100, (byte)100))
            };

            var c0 = new ColumnDefinition() { Width = GridLength.Auto };
            var c1 = new ColumnDefinition() { Width = new GridLength(1, GridUnitType.Star)};
            root.ColumnDefinitions.Add(c0);
            root.ColumnDefinitions.Add(c1);

            foodID = food._id;
            this.OnClick = onClick;

            image = new Image()
            {
                Height = 300,
                Margin = new Thickness(5),
            };
            image.HorizontalAlignment = HorizontalAlignment.Left;
            var converter = new FoodToBitmapImage();
            image.Source = converter.Convert(food, typeof(BitmapImage), null, "") as BitmapImage;


            root.Children.Add(image);
            Grid.SetColumn(image, 0);

            ver = new StackPanel()
            {
                Orientation = Orientation.Vertical,
            };

            title = new TextBlock()
            {
                Text = food.name,
                HorizontalAlignment = Windows.UI.Xaml.HorizontalAlignment.Stretch,
                HorizontalTextAlignment = Windows.UI.Xaml.TextAlignment.Center,
                FontSize = 24,
            };
            desc = new TextBlock()
            {
                Text = food.desc,
                FontSize = 18,
            };
            ver.Children.Add(title);
            ver.Children.Add(desc);

            root.Children.Add(ver);

            base.Click += click;
            base.Content = root;
            base.HorizontalAlignment = HorizontalAlignment.Stretch;
            base.HorizontalContentAlignment = HorizontalAlignment.Stretch;
            Grid.SetColumn(ver, 1);
        }

        private void click(object sender, RoutedEventArgs e)
        {
            OnClick.Invoke(foodID);
        }
    }
}
