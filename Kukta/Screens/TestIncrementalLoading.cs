//using System.Collections.ObjectModel;
//using Windows.Foundation;
//using Windows.UI.Xaml.Data;

//namespace Kukta.Screens
//{
//    public class TestIncrementalLoading : ObservableCollection<Product>, ISupportIncrementalLoading
//    {
//        public int lastItem = 1;
//        public int totalItem { get; set; }
//        public bool HasMoreItems
//        {
//            get
//            {
//                if (lastItem == totalItem)
//                {
//                    return false;
//                }
//                else
//                {
//                    return true;
//                }
//            }
//        }

//        public IAsyncOperation<LoadMoreItemsResult> LoadMoreItemsAsync(uint count)
//        {


//            return Task.Run<LoadMoreItemsResult>(async () =>
//            {
//                await coreDispatcher.RunAsync(CoreDispatcherPriority.Normal,
//                    () =>
//                    {
//                        progressBar.Visibility = Visibility.Visible;
//                    });
//                var contentDataItems = await ContentDataSource.GetIncrementalListing
//    (this.Count().ToString(), count.ToString());
//                lastItem++;
//                if (contentDataItems.Count == 0)
//                {
//                    this.totalItem = lastItem;
//                }


//                await coreDispatcher.RunAsync(CoreDispatcherPriority.Normal,
//                    () =>
//                    {
//                        foreach (Product item in contentDataItems)
//                        {
//                            this.Add(item);
//                        }
//                        progressBar.Visibility = Visibility.Collapsed;

//                    });

//                return new LoadMoreItemsResult() { Count = count };
//            }).AsAsyncOperation<LoadMoreItemsResult>();
//        }

//        IAsyncOperation<LoadMoreItemsResult> ISupportIncrementalLoading.LoadMoreItemsAsync(uint count)
//        {
//            throw new System.NotImplementedException();
//        }
//    }
//    public class Product
//    {
//        public string name;
//        public Product (string name)
//        {
//            this.name = name;
//        }
//    }
//}