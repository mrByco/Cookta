using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Kukta.FoodFramework.FileTask
{
    class DeleteCategoryTask : IFileTask
    {
        private string SubFolder;
        private string CategoryName;
        
        public DeleteCategoryTask(string subFolder, string categoryName)
        {
            SubFolder = subFolder;
            CategoryName = categoryName;
        }

        public string Name()
        {
            return "Deleting Category file";
        }

        public async Task OperateAsync()
        {
            StorageFolder storageFolder = ApplicationData.Current.LocalFolder;

            storageFolder = await storageFolder.CreateFolderAsync(SubFolder, CreationCollisionOption.OpenIfExists);
            StorageFile file = await storageFolder.GetFileAsync(CategoryName + ".json");

            await file.DeleteAsync();
            return;

        }
    }
}
