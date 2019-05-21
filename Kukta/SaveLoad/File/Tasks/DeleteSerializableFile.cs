using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace Kukta.SaveLoad.File.Tasks
{
    class DeleteSerializableFile : IFileTask
    {
        private readonly string SubFolder;
        private readonly string FileName;

        public DeleteSerializableFile(string subFolder, string fileName)
        {
            SubFolder = subFolder;
            FileName = fileName;
        }

        public string Name()
        {
            return "Deleting file";
        }

        public async Task OperateAsync()
        {
            StorageFolder storageFolder = ApplicationData.Current.LocalFolder;

            storageFolder = await storageFolder.CreateFolderAsync(SubFolder, CreationCollisionOption.OpenIfExists);
            StorageFile file = await storageFolder.GetFileAsync(FileName + ".json");

            await file.DeleteAsync();
            return;

        }
    }
}
