using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Kukta.SaveLoad.File.Tasks
{
    class SaveSerializable : IFileTask
    {

        private readonly string OldName;
        private IStorageable Storageable;
        private readonly string Subfolder;

        public string Name()
        {
            return "Saving files...";
        }

        public SaveSerializable(string subFolder, IStorageable storageable)
        {
            Subfolder = subFolder;
            Storageable = storageable;
            OldName = null;
        }
        public SaveSerializable(string subFolder, IStorageable storageable, string oldName)
        {
            Subfolder = subFolder;
            Storageable = storageable;
            OldName = oldName;
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
            }
            catch { }
            //Create new file
            StorageFile file = await storageFolder.CreateFileAsync(Storageable.GetFileName() + ".json", CreationCollisionOption.ReplaceExisting);
            var stream = await file.OpenAsync(FileAccessMode.ReadWrite);

            var dataWriter = new Windows.Storage.Streams.DataWriter(stream);
            dataWriter.WriteString(JsonConvert.SerializeObject(Storageable.GetDataClass(), Formatting.Indented));
            await dataWriter.StoreAsync();
            await stream.FlushAsync();
            stream.Dispose();
            return;
        }
    }
}
