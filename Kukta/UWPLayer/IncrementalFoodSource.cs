using Cooktapi.Food;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.UI.Core;
using Windows.UI.Xaml.Data;

namespace Kukta.UWPLayer
{
    public class IncrementalFoodSource : ObservableCollection<Food>, ISupportIncrementalLoading
    {
        private Dictionary<string, object> m_Args;
        private uint m_LastLoadedIndex;
        private CoreDispatcher Dispatcher;
        public EFoodSearchType Type { get; private set; }
        public IncrementalFoodSource(EFoodSearchType type, Dictionary<string, object> args, CoreDispatcher dispatcher)
        {
            Type = type;
            m_Args = args;
            m_LastLoadedIndex = 0;
            Dispatcher = dispatcher;
        }
        public IAsyncOperation<LoadMoreItemsResult> LoadMoreItemsAsync(uint count)
        {
            return AsyncInfo.Run(async cancelToken =>
            {
                HasMoreItems = false;
                _ = Task.Run(async () =>
                {
                    var newfoods = await Food.Search(Type, m_LastLoadedIndex, m_LastLoadedIndex + count, m_Args);

                    _ = Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                        {
                            foreach (Food food in newfoods)
                            {
                                Add(food);
                            }
                        });
                    m_LastLoadedIndex += (uint)newfoods.Count();
                    HasMoreItems = newfoods.Count() >= count;
                  });
                return new LoadMoreItemsResult { Count = count };
            });
        }

        public bool HasMoreItems { get; private set; }
    }
}
