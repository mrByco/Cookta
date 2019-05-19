using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Kukta.FoodFramework.FileTask
{
    class SaveCategoryTask : IFileTask
    {
        public string RootName;
        public FoodCategory Category;
        public string OldName = null;

        public SaveCategoryTask(string rootName, FoodCategory category)
        {
            RootName = rootName;
            Category = category;
        }
        public SaveCategoryTask(string rootName, FoodCategory category, string oldName)
        {
            RootName = rootName;
            Category = category;
            OldName = oldName;
        }

        public string Name()
        {
            return "Save category..";
        }

        public async Task OperateAsync()
        {
            StorageFolder storageFolder = ApplicationData.Current.LocalFolder;

            storageFolder = await storageFolder.CreateFolderAsync(RootName, CreationCollisionOption.OpenIfExists);
            //Delete old file if Renamed
            try
            {
                StorageFile oldFile = await storageFolder.CreateFileAsync(OldName + ".json", CreationCollisionOption.OpenIfExists);
                await oldFile.DeleteAsync();
            }
            catch { }
            //Create new file
            StorageFile file = await storageFolder.CreateFileAsync(Category.CategoryName + ".json", CreationCollisionOption.ReplaceExisting);
            var stream = await file.OpenAsync(FileAccessMode.ReadWrite);

            var dataWriter = new Windows.Storage.Streams.DataWriter(stream);
            dataWriter.WriteString(JsonConvert.SerializeObject(Category.ToData(), Formatting.Indented));
            await dataWriter.StoreAsync();
            await stream.FlushAsync();
            stream.Dispose();

            return;
        }
    }
}
