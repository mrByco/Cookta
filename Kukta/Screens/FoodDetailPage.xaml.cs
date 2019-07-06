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
using Windows.Storage;
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
        private IngredientList IngList;
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
                editMode = true;
                await SetUINewFood();
            }
            else
            {
                await SetUIShowFood(editMode);
            }
            IngredientsListPanel.Children.Clear();
            this.IngList = new IngredientList(editMode, CurrentFood?.ingredients != null ? CurrentFood.ingredients : new List<Ingredient>());
            IngredientsListPanel.Children.Add(this.IngList);
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

                ImageCropper.Visibility = Visibility.Collapsed;
                this.Image.Visibility = Visibility.Collapsed;

                UploadImageBTN.Visibility = Visibility.Visible;
                SaveBTN.Visibility = Visibility.Visible;
                EditBTN.Visibility = Visibility.Collapsed;
                DeleteBTN.Visibility = Visibility.Collapsed;
                Subscribe.Visibility = Visibility.Collapsed;
                Unsubscribe.Visibility = Visibility.Collapsed;
                IsPublicToggle.Visibility = Visibility.Visible;
                IsPublicToggle.IsOn = false;
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
                IsPublicToggle.IsOn = !CurrentFood.isPrivate;

                IsPublicToggle.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;

                ImageCropper.Visibility = Visibility.Collapsed;
                this.Image.Visibility = Visibility.Visible;
                this.Image.Source = CurrentFood.getImage;

                UploadImageBTN.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                SaveBTN.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                EditBTN.Visibility = CurrentFood.owning && !editMode ? Visibility.Visible : Visibility.Collapsed;
                DeleteBTN.Visibility = CurrentFood.owning ? Visibility.Visible : Visibility.Collapsed;
                Subscribe.Visibility = !CurrentFood.subcribed ? Visibility.Visible : Visibility.Collapsed;
                Unsubscribe.Visibility = CurrentFood.subcribed ? Visibility.Visible : Visibility.Collapsed;
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

            StorageFile storageFile = null;
            //Save the cropped image if changed
            if (ImageCropper.Visibility == Visibility.Visible)
            {
                string filename = Guid.NewGuid() + ".jpg";
                StorageFolder storageFolder = ApplicationData.Current.LocalFolder;
                storageFile = await storageFolder.CreateFileAsync(filename, CreationCollisionOption.ReplaceExisting);
                var stream = await storageFile.OpenStreamForWriteAsync();
                bool check = stream is FileStream;
                await ImageCropper.SaveAsync(stream.AsRandomAccessStream(), Microsoft.Toolkit.Uwp.UI.Controls.BitmapFileFormat.Jpeg);
                stream.Dispose();
            }

            //Replace with get current food from details
            CurrentFood = await Food.InsterFood(new Food()
            {
                _id = CurrentFood == null ? null : CurrentFood._id,
                name = TitleTextBox.Text,
                desc = DescTextBox.Text,
                ingredients = IngList.GetIngredients(),
                isPrivate = !IsPublicToggle.IsOn,
            }, storageFile);

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

        private async void UploadImageBTN_Click(object sender, RoutedEventArgs e)
        {
            var picker = new Windows.Storage.Pickers.FileOpenPicker();
            picker.ViewMode = Windows.Storage.Pickers.PickerViewMode.Thumbnail;
            picker.SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.PicturesLibrary;
            picker.FileTypeFilter.Add(".jpg");
            picker.FileTypeFilter.Add(".jpeg");
            picker.FileTypeFilter.Add(".png");

            Windows.Storage.StorageFile file = await picker.PickSingleFileAsync();
            if (file != null)
            {
                // Application now has read/write access to the picked file
                this.Image.Visibility = Visibility.Collapsed;
                ImageCropper.Visibility = Visibility.Visible;
                ImageCropper.AspectRatio = 4/3;
                await ImageCropper.LoadImageFromFile(file);
            }
            else
            {
            }
        }
    }
}
