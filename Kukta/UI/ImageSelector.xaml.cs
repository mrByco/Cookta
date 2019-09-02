using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI.Core;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Navigation;
using Cooktapi.Food;
using Kukta.Annotations;
using Microsoft.Toolkit.Uwp.UI.Controls;

// The User Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234236

namespace Kukta.UI
{
    public sealed partial class ImageSelector : UserControl, INotifyPropertyChanged
    {
        private bool m_EditMode;
        private StorageFile m_StorageFile;

        public event VoidDelegate ImageDeleted;
        public event PropertyChangedEventHandler PropertyChanged;

        public ImageSelector()
        {
            this.InitializeComponent();
        }

        public bool EditedEver { get; private set; }

        public bool EditMode    
        {
            get => m_EditMode;
            set
            {
                if (value == true) EditedEver = true;
                if (value == m_EditMode) return;
                m_EditMode = value;
                OnPropertyChanged();
            }
        }

        public StorageFile StorageFile
        {
            get => m_StorageFile;
            set
            {
                if (Equals(value, m_StorageFile)) return;
                m_StorageFile = value;
                _ = Dispatcher.RunAsync(CoreDispatcherPriority.High, () => OnPropertyChanged());
            }
        }

        public async Task<StorageFile> GetCurrentStorageFile()
        {
            if (!EditMode) return StorageFile;

            await SaveImageCropperToFile();
            EditMode = false;
            return StorageFile;
        }

        public async Task<bool> OpenImage(Uri uri)
        {
            if (uri == null)
            {
                Image.Source = new BitmapImage(Food.DefaultFoodImageUri);
                return false;
            }
            try
            {
                string filename = Guid.NewGuid() + ".jpg";
                StorageFolder storageFolder = ApplicationData.Current.LocalFolder;
                var storageFile = await storageFolder.CreateFileAsync(filename, CreationCollisionOption.ReplaceExisting);

                HttpClient client = new HttpClient();
                byte[] buffer = await client.GetByteArrayAsync(uri);
                using (Stream stream = await storageFile.OpenStreamForWriteAsync())
                {
                    stream.Write(buffer, 0, buffer.Length);
                    stream.Close();
                }
                await OpenImage(storageFile);
            }
            catch
            {
                Image.Source = new BitmapImage(Food.DefaultFoodImageUri);
                return false;
            }
            return true;
        }

        public async Task<bool> OpenImage(StorageFile file)
        {
            if (file == null)
            {
                EditMode = false;
                return false;
            }

            StorageFolder temp = ApplicationData.Current.TemporaryFolder;
            StorageFile = await file.CopyAsync(temp, Guid.NewGuid().ToString());

            var source = await FromStorageFile(StorageFile);
            Image.Source = source;
            var aspectRatio = (double)source.PixelWidth / source.PixelHeight;
            await ImageCropper.LoadImageFromFile(StorageFile);
            if (Math.Abs(aspectRatio - 1) > 0.1)
            {
                _ = Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () => EditMode = true);
            }

            return true;
        }


        private async void OnSwitchEditModeClicked(object sender, RoutedEventArgs e)
        {
            await SaveImageCropperToFile();
            Image.Source = await FromStorageFile();
            EditMode = !EditMode;

        }

        private async Task SaveImageCropperToFile()
        {
            var stream = await StorageFile.OpenStreamForWriteAsync();
            await ImageCropper.SaveAsync(stream.AsRandomAccessStream(), Microsoft.Toolkit.Uwp.UI.Controls.BitmapFileFormat.Jpeg);
            Image.Source = await FromStorageFile(StorageFile);
            stream.Dispose();
        }

        private async Task BrowseNewImage()
        {
            var picker = new Windows.Storage.Pickers.FileOpenPicker
            {
                ViewMode = Windows.Storage.Pickers.PickerViewMode.Thumbnail,
                SuggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.PicturesLibrary
            };
            picker.FileTypeFilter.Add(".jpg");
            picker.FileTypeFilter.Add(".jpeg");
            picker.FileTypeFilter.Add(".png");

            StorageFile file = await picker.PickSingleFileAsync();

            await OpenImage(file);
            return;
        }

        private async void ChangeImageBTN_click(object sender, RoutedEventArgs e)
        {
            await BrowseNewImage();
        }

        //Delete from online immidiatelly
        private void DeleteImageBTN_click(object sender, RoutedEventArgs e)
        {
            EditMode = false;
            Image.Source = new BitmapImage(Food.DefaultFoodImageUri);
            StorageFile = null;
            OnImageDeleted();
        }

        private async Task<BitmapImage> FromStorageFile()
        {
            return await FromStorageFile(StorageFile);
        }
        private static async Task<BitmapImage> FromStorageFile(StorageFile sf)
        {
            using (var randomAccessStream = await sf.OpenAsync(FileAccessMode.Read))
            {
                var result = new BitmapImage();
                await result.SetSourceAsync(randomAccessStream);
                return result;
            }
        }

        [NotifyPropertyChangedInvocator]
        private void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
        private void OnImageDeleted()
        {
            ImageDeleted?.Invoke();
        }

    }
}
