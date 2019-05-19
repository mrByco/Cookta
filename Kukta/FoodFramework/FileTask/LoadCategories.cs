using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Kukta.FoodFramework.FileTask
{
    class LoadCategories : IFileTask
    {
        private string SubFolderName;
        private Action<List<FoodCategory>> DoOnLoaded;

        public LoadCategories(string subFolderName, Action<List<FoodCategory>> onLoaded)
        {
            SubFolderName = subFolderName;
            DoOnLoaded = onLoaded;
        }

        public string Name()
        {
            return "Loading categories..";
        }

        public async Task OperateAsync()
        {
            StorageFolder storageFolder = ApplicationData.Current.LocalFolder;

            storageFolder = await storageFolder.CreateFolderAsync(SubFolderName, CreationCollisionOption.OpenIfExists);
            var files = await storageFolder.GetFilesAsync();

            List<FoodCategory> categories = new List<FoodCategory>();
            foreach (StorageFile file in files)
            {
                var stream = await file.OpenAsync(FileAccessMode.Read);
                var dataReader = new Windows.Storage.Streams.DataReader(stream);
                ulong size = stream.Size;
                uint numBytesLoaded = await dataReader.LoadAsync((uint)size);
                string jsonText = dataReader.ReadString(numBytesLoaded);
                try
                {
                    FoodCategoryData data = JsonConvert.DeserializeObject<FoodCategoryData>(jsonText);
                    categories.Add(FoodCategory.FromData(data));
                }
                catch { }
                stream.Dispose();
            }
            DoOnLoaded(categories);
            return;
        }
    }
}
