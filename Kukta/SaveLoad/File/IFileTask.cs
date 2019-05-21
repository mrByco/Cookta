using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kukta.SaveLoad.File
{
    interface IFileTask
    {
        string Name();
        Task OperateAsync();

    }
}
