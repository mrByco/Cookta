using Kukta.FoodFramework;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Kukta.SaveLoad.File.Tasks
{
    class LoadAllSerializableFromFolder<Original, Data> : IFileTask
        where Original : new()
    {
        private readonly string SubFolder;
        private readonly Action<List<Original>> onLoaded;
        public LoadAllSerializableFromFolder(string subFolder, Action<List<Original>> onLoaded)
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
            List<Original> items = new List<Original>();
            foreach (StorageFile file in files)
            {
                string jsonText = await FileIO.ReadTextAsync(file);
                if (jsonText == "")
                {
                    continue;
                }
                IStorageable item = new Original() as IStorageable;
                item.FromDataClass(JsonConvert.DeserializeObject<Data>(jsonText));
                items.Add((Original)item);
            }
            onLoaded?.Invoke(items);
            return;
        }
    }
}
