﻿using Cooktapi.Food;
using Cooktapi.Networking;
using Kukta.ContentDialogs;
using Kukta.UI;
using RestSharp;
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
using Windows.UI.Xaml.Media.Imaging;
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
        public User CurrentUser;
        //private IngredientList IngList;
        private int CurrentDose = 4;
        public FoodDetailPage()
        {
            this.InitializeComponent();
        }
        private List<Tag> m_CurrentTags;
        public List<string> CurrentTags
        {
            get
            {
                return CurrentTags;
            }
            set
            {
                m_CurrentTags = Cooktapi.Food.Tag.GetTagsByTexts(value, "hu-hu");
            }
        }
        private bool m_EditMode;
        public bool EditMode
        {
            get
            {
                return m_EditMode;
            }
            set
            {
                m_EditMode = value;
            }
        }
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);
            _ = Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { _ = Load(e.Parameter as string, false); });
        }
        public async Task Load(string id, bool editMode)
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

            CurrentUser = await User.GetUser(CurrentFood?.owner ?? OwnUser.CurrentUser.Sub);

            if (CurrentFood == null)
            { 
                editMode = true;
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
                EditMode = true;
                TitleTextBlock.Visibility = Visibility.Collapsed;
                DescTextBlock.Visibility = Visibility.Collapsed;
                TitleTextBox.Visibility = Visibility.Visible;
                DescTextBox.Visibility = Visibility.Visible;

                ImageCropper.Visibility = Visibility.Collapsed;
                this.Image.Visibility = Visibility.Collapsed;
                ReportNoIngredient.Visibility = Visibility.Visible;
                OtherSettingsTextBlock.Visibility = Visibility.Visible;
                Tags.EditEnabled = true;
                DoseTextBox.Visibility = Visibility.Visible;
                DoseTextBlock.Visibility = Visibility.Collapsed;
                UploaderPicture.Visibility = Visibility.Collapsed;
                UploaderName.Visibility = Visibility.Collapsed;
                LastModified.Visibility = Visibility.Collapsed;
                IngredientList.EditMode = true;
                IngredientList.SetItems(new List<Ingredient>());
                LastReport.Visibility =Visibility.Collapsed;
                LastReport.Report = null;
                MoreOptionsButton.Visibility =  Visibility.Visible;


                UploadImageBTN.Visibility = Visibility.Visible;
                SaveBTN.Visibility = Visibility.Visible;
                EditBTN.Visibility = Visibility.Collapsed;
                DeleteBTN.Visibility = Visibility.Collapsed;
                SubscribeBTN.Visibility = Visibility.Collapsed;
                UnsubscribeBTN.Visibility = Visibility.Collapsed;
                IsPublicToggle.Visibility = Visibility.Visible;
                IsPublicToggle.IsOn = false;
            });
        }
        private async Task SetUIShowFood(bool editMode)
        {
            EditMode = editMode;
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
                DoseTextBox.Text = CurrentFood?.dose.ToString() ?? 4.ToString();
                DoseTextBlock.Text = CurrentFood?.dose.ToString() ?? 4.ToString();
                UploaderName.Visibility = Visibility.Visible;
                LastModified.Visibility = Visibility.Visible;
                UploaderPicture.Visibility = Visibility.Visible;
                if (CurrentUser.ProfilPic != null)
                    UploaderPicture.ProfilePicture = new BitmapImage(new Uri(CurrentUser.ProfilPic ?? "", UriKind.Absolute));
                UploaderName.Content = CurrentUser.DisplayName;
                LastModified.Text = CurrentFood.LastModified.ToString("yyyy-MM-dd hh:mm");
                IngredientList.EditMode = editMode;
                IngredientList.SetItems(CurrentFood.ingredients);
                MoreOptionsButton.Visibility = CurrentFood.owning ? Visibility.Visible : Visibility.Collapsed;


                DoseTextBox.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                DoseTextBlock.Visibility = editMode ? Visibility.Collapsed : Visibility.Visible;
                ReportNoIngredient.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                OtherSettingsTextBlock.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                IsPublicToggle.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                Tags.EditEnabled = editMode;
                Tags.Tags = CurrentFood.Tags;
                LastReport.Visibility = CurrentFood.report == null ? Visibility.Collapsed : Visibility.Visible;
                LastReport.Report = CurrentFood.report;
                


                ImageCropper.Visibility = Visibility.Collapsed;

                this.Image.Visibility = Visibility.Visible;
                this.Image.Source = new BitmapImage(CurrentFood.getImage)
                {
                    CreateOptions = Food.GetCacheingEnabled(CurrentFood._id, CurrentFood.imageUploaded) ? BitmapCreateOptions.None : BitmapCreateOptions.IgnoreImageCache
                };

                UploadImageBTN.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                SaveBTN.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                EditBTN.Visibility = CurrentFood.owning && !editMode ? Visibility.Visible : Visibility.Collapsed;
                DeleteBTN.Visibility = CurrentFood.owning ? Visibility.Visible : Visibility.Collapsed;
                SubscribeBTN.Visibility = !CurrentFood.subcribed ? Visibility.Visible : Visibility.Collapsed;
                UnsubscribeBTN.Visibility = CurrentFood.subcribed ? Visibility.Visible : Visibility.Collapsed;
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
        private void RefreshIsValid()
        {
            TitleErrorTextBlock.Visibility = Visibility.Collapsed;
            DescErrorTextBlock.Visibility = Visibility.Collapsed;
            SaveBTN.IsEnabled = false;

            if (TitleTextBox.Text.Length > 39 || TitleTextBox.Text.Length < 6)
            {
                TitleErrorTextBlock.Text = "Maximum 39 karakter, minimum 6.";
                TitleErrorTextBlock.Visibility = Visibility.Visible;
                return;
            }

            SaveBTN.IsEnabled = true;
        }
        private async Task SaveCurrentFood()
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
            var ingredients = IngredientList.GetIngredients();

            //Replace with get current food from details
            CurrentFood = await Food.InstertFood(new Food()
            {
                _id = CurrentFood == null ? null : CurrentFood._id,
                name = TitleTextBox.Text,
                desc = DescTextBox.Text,
                dose = CurrentDose,
                ingredients = IngredientList.GetIngredients(),
                isPrivate = !IsPublicToggle.IsOn,
                Tags = Tags.Tags
            }, storageFile?.Path ?? "");

            await SetLoading(false);
            _ = Load(CurrentFood._id, false);
        }

        private async void EditBTN_Click(object sender, RoutedEventArgs e)
        {
            _ = Load(CurrentFood._id, true);
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
                ImageCropper.AspectRatio = 4 / 3;
                await ImageCropper.LoadImageFromFile(file);
            }
            else
            {
            }
        }

        private void SubscribeBTN_Click(object sender, RoutedEventArgs e)
        {
            SetSubStateForFood(true);
        }

        private void UnsubscribeBTN_Click(object sender, RoutedEventArgs e)
        {
            SetSubStateForFood(false);
        }
        private async void SetSubStateForFood(bool sub)
        {
            await CurrentFood.SetSubForfood(sub);
            _ = Load(CurrentFood._id, false);
            return;
        }

        private async void ReportNoIngredientBTN_click(object sender, RoutedEventArgs e)
        {
            await new ReportNotFountIngredientDialog().ShowAsync();
        }

        private void TagPanel_TagsChanged(TagPanel panel, List<Tag> tags)
        {

        }

        private void DoseTextBox_TextChanged(object sender, TextChangedEventArgs args)
        {
            TextBox textBox = sender as TextBox;
            try
            {
                if (textBox.Text == "")
                {
                    CurrentDose = 4;
                    textBox.PlaceholderText = 4.ToString();
                    return;
                }
                int newValue = int.Parse(textBox.Text);
                CurrentDose = newValue;
            }
            catch (FormatException e)
            {
                textBox.Text = CurrentFood.dose.ToString();
            }
        }

        private void TitleTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            RefreshIsValid();
        }

        private void UploaderName_Click(object sender, RoutedEventArgs e)
        {
            MainPage.NavigateTo("account", null, CurrentUser?.Sub);
        }

        private void MoreDetailsButton_Click(object sender, RoutedEventArgs e)
        {
            ContentSplitView.IsPaneOpen = true;
        }

        private void CloseOptions_Click(object sender, RoutedEventArgs e)
        {
            ContentSplitView.IsPaneOpen = false;
        }
        public async Task BeforeNavigatingFrom()
        {
            if (EditMode)
            {
                var dialog = new ContentDialog();
                dialog.Title = "Mentés?";
                dialog.Content = "Biztosan továbblépsz mentés nélkül?";
                dialog.PrimaryButtonText = "Továbblépés";
                dialog.SecondaryButtonText = "Mentés és továbblépés";
                dialog.SecondaryButtonClick += async (sender, args) => { await SaveCurrentFood(); };
                await dialog.ShowAsync();
            }
        }
        protected override async void OnNavigatingFrom(NavigatingCancelEventArgs e)
        {
            base.OnNavigatingFrom(e);
        }
    }
}
