
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.SaveLoad.File
{
    class FileManager
    {
        private List<IFileTask> fileTasks = new List<IFileTask>();
        public void AddTask(IFileTask task)
        {
            fileTasks.Add(task);
            if (fileTasks.Count == 1)
            {
                DoNextTask();
            }
        }
        private async void DoNextTask()
        {
            if (fileTasks.Count > 0)
            {
                await fileTasks[0].OperateAsync();
                fileTasks.RemoveAt(0);
                DoNextTask();
                return;
            }
        }
    }
}
