using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Kukta.FoodFramework.FileTask
{
    class DeleteFoodFileAsync : IFileTask
    {
        private string RootFolder;
        private string FoodName;

        public DeleteFoodFileAsync(string customFoodRootFolder, string foodName)
        {
            RootFolder = customFoodRootFolder;
            FoodName = foodName;
        }

        public string Name()
        {
            return "Delete file...";
        }

        public async Task OperateAsync()
        {
            StorageFolder storageFolder = ApplicationData.Current.LocalFolder;

            storageFolder = await storageFolder.CreateFolderAsync(RootFolder, CreationCollisionOption.OpenIfExists);
            StorageFile file = await storageFolder.GetFileAsync(FoodName + ".json");

            await file.DeleteAsync();
            return;
        }
        
    }
}
