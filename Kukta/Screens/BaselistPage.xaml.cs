using Cooktapi.Shopping;
using System;
using System.Collections.Generic;
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
    public sealed partial class BaselistPage : Page
    {
        public BaselistPage()
        {
            this.InitializeComponent();
        }

        private void IngredientPanel_OnIngredientAdded(Cooktapi.Food.Ingredient added)
        {
            Task.Run(async () =>
            {
                await Baselist.AddItemToBaseList(added);
            });
        }
        private void IngredientPanel_OnIngredientRemoved(Cooktapi.Food.Ingredient removed)
        {
            Task.Run(async () =>
            {
                await Baselist.DeleteItemFromBaseList(removed.Type);
            });
        }

        private async Task SetLoading(bool loading)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal,() =>
            {
                Loading.Visibility = loading ? Visibility.Visible : Visibility.Collapsed;
                MainContent.Visibility = !loading ? Visibility.Visible : Visibility.Collapsed;
            });
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            Task.Run(async () => 
            {
                await SetLoading(true);
                var ings = await Baselist.GetBaseList();
                IngredientPanel.SetItems(ings);
                await SetLoading(false);
            });
        }
    }
}
