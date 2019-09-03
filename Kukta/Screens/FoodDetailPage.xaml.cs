using Cooktapi.Food;
using Cooktapi.Networking;
using Kukta.ContentDialogs;
using Kukta.UI;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
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
using Kukta.Annotations;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class FoodDetailPage : Page, INotifyPropertyChanged
    {
        private List<Tag> m_CurrentTags;
        private int m_CurrentDose = 4;
        private Food m_CurrentFood;

        public Food CurrentFood     
        {
            get => m_CurrentFood;
            set
            {
                if (Equals(value, m_CurrentFood)) return;
                m_CurrentFood = value;
                OnPropertyChanged();
            }
        }

        public User CurrentUser;

        public FoodDetailPage()
        {
            this.InitializeComponent();
        }
        public List<string> CurrentTags
        {
            private get => CurrentTags;
            set => m_CurrentTags = Cooktapi.Food.Tag.GetTagsByTexts(value, "hu-hu");
        }

        public bool EditMode { get; set; }

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

            CurrentUser = await User.GetUser(CurrentFood?.Owner ?? OwnUser.CurrentUser.Sub);

            if (CurrentFood == null)
            { 
                editMode = true;
                await SetUiNewFood();
            }
            else
            {
                if (editMode)
                {
                    await ImageSelector.OpenImage(CurrentFood.GetImage);
                }
                await SetUiShowFood(editMode);
            }
            await SetLoading(false);
        }
        private async Task SetUiNewFood()
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                EditMode = true;
                TitleTextBlock.Visibility = Visibility.Collapsed;
                DescTextBlock.Visibility = Visibility.Collapsed;
                TitleTextBox.Visibility = Visibility.Visible;
                DescTextBox.Visibility = Visibility.Visible;

                ImageSelector.Visibility = Visibility.Visible;
                Image.Visibility = Visibility.Collapsed;
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


                SaveBTN.Visibility = Visibility.Visible;
                EditBTN.Visibility = Visibility.Collapsed;
                DeleteBTN.Visibility = Visibility.Collapsed;
                SubscribeBTN.Visibility = Visibility.Collapsed;
                UnsubscribeBTN.Visibility = Visibility.Collapsed;
                IsPublicToggle.Visibility = Visibility.Visible;
                IsPublicToggle.IsOn = false;
            });
        }
        private async Task SetUiShowFood(bool editMode)
        {
            EditMode = editMode;
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {

                TitleTextBlock.Visibility = !editMode ? Visibility.Visible : Visibility.Collapsed;
                DescTextBlock.Visibility = !editMode ? Visibility.Visible : Visibility.Collapsed;

                TitleTextBox.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                DescTextBox.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;

                TitleTextBox.Text = CurrentFood.Name;
                TitleTextBlock.Text = CurrentFood.Name;
                DescTextBox.Text = CurrentFood.Desc;
                DescTextBlock.Text = CurrentFood.Desc;
                IsPublicToggle.IsOn = !CurrentFood.IsPrivate;
                DoseTextBox.Text = CurrentFood?.Dose.ToString() ?? 4.ToString();
                DoseTextBlock.Text = CurrentFood?.Dose.ToString() ?? 4.ToString();
                UploaderName.Visibility = Visibility.Visible;
                LastModified.Visibility = Visibility.Visible;
                UploaderPicture.Visibility = Visibility.Visible;
                if (CurrentUser.ProfilPic != null)
                    UploaderPicture.ProfilePicture = new BitmapImage(new Uri(CurrentUser.ProfilPic ?? "", UriKind.Absolute));
                UploaderName.Content = CurrentUser.DisplayName;
                LastModified.Text = CurrentFood.LastModified.ToString("yyyy-MM-dd hh:mm");
                IngredientList.EditMode = editMode;
                IngredientList.SetItems(CurrentFood.Ingredients);
                MoreOptionsButton.Visibility = CurrentFood.Owning ? Visibility.Visible : Visibility.Collapsed;


                DoseTextBox.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                DoseTextBlock.Visibility = editMode ? Visibility.Collapsed : Visibility.Visible;
                ReportNoIngredient.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                OtherSettingsTextBlock.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                IsPublicToggle.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                Tags.EditEnabled = editMode;
                Tags.Tags = CurrentFood.Tags.ToList();
                AutoTags.Tags = CurrentFood.AutoTags.ToList();
                LastReport.Visibility = CurrentFood.Report == null ? Visibility.Collapsed : Visibility.Visible;
                LastReport.Report = CurrentFood.Report;
                


                ImageSelector.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                Image.Visibility = !editMode ? Visibility.Visible : Visibility.Collapsed;

                this.Image.Source = new BitmapImage(CurrentFood.GetImage ?? Food.DefaultFoodImageUri)
                {
                    CreateOptions = Food.GetCacheingEnabled(CurrentFood.Id, CurrentFood.ImageUploaded) ? BitmapCreateOptions.None : BitmapCreateOptions.IgnoreImageCache
                };

                SaveBTN.Visibility = editMode ? Visibility.Visible : Visibility.Collapsed;
                EditBTN.Visibility = CurrentFood.Owning && !editMode ? Visibility.Visible : Visibility.Collapsed;
                DeleteBTN.Visibility = CurrentFood.Owning ? Visibility.Visible : Visibility.Collapsed;
                SubscribeBTN.Visibility = !CurrentFood.Subcribed ? Visibility.Visible : Visibility.Collapsed;
                UnsubscribeBTN.Visibility = CurrentFood.Subcribed ? Visibility.Visible : Visibility.Collapsed;
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

            //We need check file has changed or not
            var storageFile = ImageSelector.EditedEver ? await ImageSelector.GetCurrentStorageFile() : null;

            //Replace with get current food from details
            CurrentFood = await Food.InstertFood(new Food()
            {
                Id = CurrentFood?.Id,
                Name = TitleTextBox.Text,
                Desc = DescTextBox.Text,
                Dose = m_CurrentDose,
                Ingredients = IngredientList.GetIngredients(),
                IsPrivate = !IsPublicToggle.IsOn,
                Tags = new ObservableCollection<Tag>(Tags.Tags),
            }, storageFile?.Path ?? "");

            await SetLoading(false);
            _ = Load(CurrentFood.Id, false);
        }

        private void EditBTN_Click(object sender, RoutedEventArgs e) => _ = Load(CurrentFood.Id, true);

        private async void DeleteBTN_Click(object sender, RoutedEventArgs e)
        {
            await SetLoading(true);
            await Food.Delete(CurrentFood.Id);
            await SetLoading(false);
            MainPage.NavigateTo("foods", null, null);
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
            _ = Load(CurrentFood.Id, false);
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
                    m_CurrentDose = 4;
                    textBox.PlaceholderText = 4.ToString();
                    return;
                }
                int newValue = int.Parse(textBox.Text);
                m_CurrentDose = newValue;
            }
            catch (FormatException e)
            {
                textBox.Text = CurrentFood.Dose.ToString();
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

        private void ImageSelector_OnImageDeleted()
        {
            if (CurrentFood?.Id == null) return;
            {
                _ = Food.DeleteImage(CurrentFood.Id);
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        [NotifyPropertyChangedInvocator]
        private void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));  
        }
    }
}
