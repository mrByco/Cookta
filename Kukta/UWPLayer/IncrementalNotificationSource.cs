using Cooktapi.Food;
using Cooktapi.Networking;
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
    public class IncrementalNotificationSource : ObservableCollection<Notification>, ISupportIncrementalLoading
    {
        private uint m_LastLoadedIndex;
        private CoreDispatcher Dispatcher;
        private bool m_AllowArhived = false;
        public bool AllowArhived
        {
            get => m_AllowArhived;
            set
            {
                m_AllowArhived = value;
                Clear();
                m_LastLoadedIndex = 0;
                HasMoreItems = true;
                _ = LoadMoreItemsAsync(1);
            }
        }

        public IncrementalNotificationSource(CoreDispatcher dispatcher)
        {
            m_LastLoadedIndex = 0;
            Dispatcher = dispatcher;
            HasMoreItems = true;
        }
        public IAsyncOperation<LoadMoreItemsResult> LoadMoreItemsAsync(uint count)
        {
            HasMoreItems = false;
            uint old_maxLoaded = m_LastLoadedIndex;
            m_LastLoadedIndex += count;
            return AsyncInfo.Run(async cancelToken =>
            {
                HasMoreItems = false;
                _ = Task.Run(async () =>
                {
                    var newNotifications = await NotificationManager.GetNotifications(old_maxLoaded, old_maxLoaded + count, AllowArhived);

                    _ = Dispatcher.RunAsync(CoreDispatcherPriority.Normal, () =>
                    {
                        foreach (Notification Notification in newNotifications)
                        {
                            Add(Notification);
                        }
                    });
                    HasMoreItems = newNotifications.Count() >= count;
                });
                return new LoadMoreItemsResult { Count = count };
            });
        }
        public void SetItemArhived(string id)
        {
            Notification item = null;
            foreach (Notification notification in Items)
            {
                if (notification.ID == id)
                {
                    item = notification;
                }
            }
            if (item != null)
            {
                item.Arhived = (long)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1, 0, 0, 0)).TotalMilliseconds;
                if (!AllowArhived)
                    Remove(item);
            }
        }

        public bool HasMoreItems { get; private set; }
    }
}
