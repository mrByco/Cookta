using Cooktapi.Stocker;
using Kukta.UI;
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
            if (selectedItem != null)
                ShowItemOptions(selectedItem, (UIElement)e.OriginalSource, e.GetPosition((UIElement)e.OriginalSource));
        }

        private void ShowItemOptions(StockItem stockItem, UIElement sender, Point point)
        {
            MenuFlyout flyout = new MenuFlyout();

            MenuFlyoutItem ChangeValueItem = new MenuFlyoutItem()
            {
                Text = "Érték változtatás",
            };
            flyout.Items.Add(ChangeValueItem);
            ChangeValueItem.Click += (a, b) => { SetValueItem_Click(stockItem, a as FrameworkElement); };
            ChangeValueItem.Click += (a, b) => { flyout.Hide(); };


            MenuFlyoutItem DeleteItem = new MenuFlyoutItem()
            {
                Text = "Törlés",
            };
            flyout.Items.Add(DeleteItem);
            DeleteItem.Click += (a, b) => { DeleteItem_Click(stockItem); };
            DeleteItem.Click += (a, b) => { flyout.Hide(); };

            flyout.ShowAt(sender as UIElement, point);

        }
        private void SetValueItem_Click(StockItem item, FrameworkElement element)
        {
            ContentDialog dialog = new ContentDialog();
            Grid grid = new Grid();

            grid.RowDefinitions.Clear();
            grid.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(1, GridUnitType.Auto) });
            grid.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(1, GridUnitType.Auto) });

            grid.ColumnDefinitions.Clear();
            grid.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(1, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(1, GridUnitType.Star) });

            dialog.Content = grid;


            TextBlock titleText = new TextBlock() { Text = string.Format("Leltározás: {0}", item.IngredientType.Name), VerticalAlignment = VerticalAlignment.Center };
            Grid.SetColumnSpan(titleText, 3);
            grid.Children.Add(titleText);

            TextBlock text = new TextBlock() { Text = "Új érték: ", VerticalAlignment = VerticalAlignment.Center};
            Grid.SetRow(text, 1);
            Grid.SetColumn(text, 0);
            grid.Children.Add(text);


            TextBox valueTextBox = new TextBox() { PlaceholderText = "pl.: 5", Text = item.Value.ToString(), VerticalAlignment = VerticalAlignment.Center};
            Grid.SetRow(valueTextBox, 1);
            Grid.SetColumn(valueTextBox, 1);
            valueTextBox.Height = 40;
            valueTextBox.TextChanged += OnValueText_Changed;
            grid.Children.Add(valueTextBox);

            Button SaveBTN = new Button()
            {
                Content = "Beállítás",
                VerticalAlignment = VerticalAlignment.Center,
            };
            Grid.SetRow(valueTextBox, 1);
            Grid.SetColumn(valueTextBox, 2);
            SaveBTN.Click += async (a, b) =>
            {
                await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { dialog.Hide(); });
                await item.SetValue(newValue);
                ReloadItems();
            };

            grid.Children.Add(SaveBTN);
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
            dialog.ShowAsync();
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
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

        private async void IngredientAdderControl_OnIngredeintAdded(Cooktapi.Food.Ingredient added)
        {
            await Stock.AddItemToStock(added.Type, added.Unit, added.Value);
            ReloadItems();
        }
    }
}
