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
    class SaveFoodToFile : IFileTask
    {
        private string OldName;
        private Food Food;
        private string Subfolder;

        public SaveFoodToFile(Food food, string subFolder)
        {
            Subfolder = subFolder;
            Food = food;
            OldName = null;
        }
        public SaveFoodToFile(Food food, string subFolder, string oldName)
        {
            Subfolder = subFolder;
            Food = food;
            OldName = oldName;
        }

        public string Name()
        {
            return "Saving foods...";
        }

        public async Task OperateAsync()
        {
            StorageFolder storageFolder = ApplicationData.Current.LocalFolder;

            storageFolder = await storageFolder.CreateFolderAsync(Subfolder, CreationCollisionOption.OpenIfExists);
            //Delete old file if Renamed
            try
            {
                StorageFile oldFile = await storageFolder.CreateFileAsync(OldName + ".json", CreationCollisionOption.OpenIfExists);
                await oldFile.DeleteAsync();
            } catch { }
            //Create new file
            StorageFile file = await storageFolder.CreateFileAsync(Food.Name + ".json", CreationCollisionOption.ReplaceExisting);
            var stream = await file.OpenAsync(FileAccessMode.ReadWrite);

            var dataWriter = new Windows.Storage.Streams.DataWriter(stream);
            dataWriter.WriteString(JsonConvert.SerializeObject(Food.ToFoodData(), Formatting.Indented));
            await dataWriter.StoreAsync();
            await stream.FlushAsync();
            stream.Dispose();

            return;
        }
    }
}
