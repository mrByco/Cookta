using Cooktapi.Food;
using Cooktapi.Shopping;
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
    public sealed partial class ShoppingListPage : Page
    {
        public ShoppingListPage()
        {
            this.InitializeComponent();
        }

        public readonly ObservableCollection<Ingredient> m_Items = new ObservableCollection<Ingredient>();
        public ObservableCollection<Ingredient> ItemPresenter
        {
            get
            {
                return m_Items;
            }
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            Task.Run(async () => { RefreshUnShopped(); });
        }

        private async void RefreshUnShopped()
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { ItemPresenter.Clear(); });
            var items = await ShoppingList.GetFinalShoppingList(7);
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                foreach (Ingredient ing in items)
                {
                    m_Items.Add(ing);
                }
            });
        }
    }
}
