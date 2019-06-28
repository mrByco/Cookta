using Kukta.FoodFrameworkV2;
using Kukta.FrameWork;
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
    public sealed partial class FoodDetailPage : Page
    {
        public Food CurrentFood = null;
        public FoodDetailPage()
        {
            this.InitializeComponent();
        }
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);
            Update(e.Parameter as string, false);
        }
        private async void Update(string id, bool editMode)
        {
            await SetLoading(true);
            if (id == null)
            {
                CurrentFood = null;
            }
            else
            {
                CurrentFood = await Food.Get(id);
            }
            if (CurrentFood == null)
            {
                await SetUINewFood();
            }
            else
            {
                await SetUIShowFood(editMode);
            }
            await SetLoading(false);
        }
        private async Task SetUINewFood()
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                TitleTextBlock.Visibility = Visibility.Collapsed;
                DescTextBlock.Visibility = Visibility.Collapsed;
                TitleTextBox.Visibility = Visibility.Visible;
                DescTextBox.Visibility = Visibility.Visible;

                SaveBTN.Visibility = Visibility.Visible;
                EditBTN.Visibility = Visibility.Collapsed;
                DeleteBTN.Visibility = Visibility.Collapsed;
                Subscribe.Visibility = Visibility.Collapsed;
                Unsubscribe.Visibility = Visibility.Collapsed;
            });
        }
        private async Task SetUIShowFood(bool editMode)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {

                TitleTextBlock.Visibility = !editMode ? Visibility.Visible : Visibility.Collapsed;
                DescTextBlock.Visibility = !editMode ? Visibility.Visible : Visibility.Collapsed;

                TitleTextBox.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                DescTextBox.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;

                TitleTextBox.Text = CurrentFood.name;
                TitleTextBlock.Text = CurrentFood.name;
                DescTextBox.Text = CurrentFood.desc;
                DescTextBlock.Text = CurrentFood.desc;
                
                SaveBTN.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                EditBTN.Visibility = CurrentFood.owning && !editMode ? Visibility.Visible : Visibility.Collapsed;
                DeleteBTN.Visibility = CurrentFood.owning ? Visibility.Visible : Visibility.Collapsed;
                Subscribe.Visibility = !CurrentFood.subcribed ? Visibility.Visible : Visibility.Collapsed;
                Unsubscribe.Visibility = CurrentFood.subcribed ? Visibility.Visible : Visibility.Collapsed; ;
            });
        }

        private async Task SetLoading(bool loading)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                if (loading)
                {
                    Content.Visibility = Visibility.Collapsed;
                    ButtonBar.Visibility = Visibility.Collapsed;
                    ProgressRing.Visibility = Visibility.Visible;
                }
                else
                {
                    Content.Visibility = Visibility.Visible;
                    ButtonBar.Visibility = Visibility.Visible;
                    ProgressRing.Visibility = Visibility.Collapsed;
                }
            });
        }

        private void SaveBTN_Click(object sender, RoutedEventArgs e)
        {
            SaveCurrentFood();
        }
        private async void SaveCurrentFood()
        {
            await SetLoading(true);
            //Replace with get current food from details
            CurrentFood = await Food.InsterFood(new Food()
            {
                name = TitleTextBox.Text,
                desc = DescTextBox.Text,

            }) ;

            await SetLoading(false);
            Update(CurrentFood._id, false);
        }

        private async void EditBTN_Click(object sender, RoutedEventArgs e)
        {
            Update(CurrentFood._id, true);
        }

        private async void DeleteBTN_Click(object sender, RoutedEventArgs e)
        {
            await SetLoading(true);
            await Food.Delete(CurrentFood._id);
            await SetLoading(false);
            MainPage.NavigateTo("foods", null, null);
        }
    }
}
