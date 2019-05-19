using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Kukta.FoodFramework.FileTask
{
    class ReadCustomFoodsFromFileAsync : IFileTask
    {
        private string SubFolder;
        private Action<List<Food>> onLoaded;
        public ReadCustomFoodsFromFileAsync(string subFolder, Action<List<Food>> onLoaded)
        {
            SubFolder = subFolder;
            this.onLoaded = onLoaded;
        }

        public string Name()
        {
            return "Load foods";
        }

        public async Task OperateAsync()
        {
            StorageFolder storageFolder = ApplicationData.Current.LocalFolder;

            storageFolder = await storageFolder.CreateFolderAsync(SubFolder, CreationCollisionOption.OpenIfExists);
            var files = await storageFolder.GetFilesAsync();

            List<Food> foods = new List<Food>();
            foreach (StorageFile file in files)
            {
                string jsonText = await FileIO.ReadTextAsync(file);
                try
                {
                    Food food = Food.FromFoodData(JsonConvert.DeserializeObject<FoodData>(jsonText));
                    foods.Add(food);
                }
                catch { }
            }
            if (onLoaded != null)
                onLoaded(foods);
            return;
        }
    }
}
