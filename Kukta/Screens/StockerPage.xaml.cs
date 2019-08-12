using Cooktapi.Stocker;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
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
    public sealed partial class StockerPage : Page
    {
        public StockerPage()
        {
            this.InitializeComponent();
        }
        public readonly ObservableCollection<StockItem> StockItems = new ObservableCollection<StockItem>();
        private double newValue = 0;
        private StockItem selectedItem;

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            Task.Run(() => { ReloadItems(); });
        }
        private async void ReloadItems()
        {
            List<StockItem> stockItemList = await Stock.GetCurrentStock();
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                StockItems.Clear();
                stockItemList.ForEach((i) => { StockItems.Add(i); });
            });
        }

        private void StockListView_ItemClick(object sender, ItemClickEventArgs e)
        {
            selectedItem = e.ClickedItem as StockItem;
        }
        private void ListView_Tapped(object sender, TappedRoutedEventArgs e)
        {
            ShowItemOptions(selectedItem, (UIElement) e.OriginalSource, e.GetPosition((UIElement)e.OriginalSource));
        }

        private void ShowItemOptions(StockItem stockItem, UIElement sender, Point point)
        {
            MenuFlyout flyout = new MenuFlyout();

            MenuFlyoutItem ChangeValueItem = new MenuFlyoutItem()
            {
                Text = "Érték változtatás",
            };
            flyout.Items.Add(ChangeValueItem);
            ChangeValueItem.Click += (a, b) => { SetValueItem_Click(stockItem); };
            ChangeValueItem.Click += (a, b) => { flyout.Hide(); };


            MenuFlyoutItem DeleteItem = new MenuFlyoutItem()
            {
                Text = "Törlés",
            };
            flyout.Items.Add(DeleteItem);
            DeleteItem.Click +=  (a, b) => { DeleteItem_Click(stockItem); };
            DeleteItem.Click += (a, b) => { flyout.Hide(); };

            flyout.ShowAt(sender as UIElement, point);

        }
        private void SetValueItem_Click(StockItem item)
        {
            Flyout flyout = new Flyout();
            StackPanel stack = new StackPanel() { Orientation = Orientation.Horizontal };
            flyout.Content = stack;

            TextBlock text = new TextBlock() { Text = "Új érték: ", };
            stack.Children.Add(text);


            TextBox valueTextBox = new TextBox() { PlaceholderText = "pl.: 5", Text = item.Value.ToString(), };
            valueTextBox.TextChanged += OnValueText_Changed;
            stack.Children.Add(valueTextBox);

            Button SaveBTN = new Button()
            {
                Content = "Beállítás",
            };
            SaveBTN.Click += async (a, b) => 
            {
                await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { flyout.Hide(); });
                await item.SetValue(newValue);
                ReloadItems();
            };

        }

        private void OnValueText_Changed(object sender, TextChangedEventArgs e)
        {
            TextBox textBox = sender as TextBox;
            try
            {
                if (textBox.Text == "")
                {
                    newValue = 0;
                    return;
                }
                string s = textBox.Text.Replace('.', ',');
                if (s.StartsWith(','))
                    s = "0" + s;
                if (s.EndsWith(','))
                {
                    s = s + "0";
                }
                newValue = Double.Parse(s);
            }
            catch (FormatException)
            {
                textBox.Text = newValue.ToString();
            };
        }

        private async void DeleteItem_Click(StockItem item)
        {
            await item.Delete();
            ReloadItems();
        }

        private void AddStockItem_Click(object sender, RoutedEventArgs e)
        {
            //IngredientAdderFlyout
            Flyout flyout;
        }
    }
}
