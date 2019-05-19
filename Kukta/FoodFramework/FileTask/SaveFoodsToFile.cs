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
    class SaveFoodsToFile : IFileTask
    {
        private List<Food> Foods;
        private string Subfolder;

        public SaveFoodsToFile(List<Food> foods, string subFolder)
        {
            Subfolder = subFolder;
            Foods = foods;
        }

        public string Name()
        {
            return "Saving foods";
        }

        public async Task OperateAsync()
        {
            StorageFolder storageFolder = ApplicationData.Current.LocalFolder;

            storageFolder = await storageFolder.CreateFolderAsync(Subfolder, CreationCollisionOption.OpenIfExists);

            foreach (Food food in Foods)
            {
                StorageFile file = await storageFolder.CreateFileAsync(food.Name + ".json", CreationCollisionOption.ReplaceExisting);
                Stream stream = await file.OpenStreamForWriteAsync();

                var dataWriter = new Windows.Storage.Streams.DataWriter(stream.AsOutputStream());
                dataWriter.WriteString(JsonConvert.SerializeObject(food.ToFoodData()));
                await dataWriter.StoreAsync();
                await stream.FlushAsync();
            }

            return;
        }
    }
}
