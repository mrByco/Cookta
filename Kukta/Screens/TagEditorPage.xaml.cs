using Cooktapi.Food;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.UI.Xaml.Controls;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class TagEditorPage : Page, INotifyPropertyChanged
    {
        public TagEditorPage()
        {
            this.InitializeComponent();
        }
        private Tag tag = null;
        public Tag SelectedTag
        {
            get { return tag; }
            set
            {
                tag = value;
                OnPropertyChanged("SelectedTag");
                OnPropertyChanged("IsDetailPaneOpen");
            }
        }
        public bool IsDetailPaneOpen
        {
            get
            {
                return SelectedTag != null;
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        public async Task RefreshItems()
        {

            //SetLoading
            await Cooktapi.Food.Tag.DownloadTags();
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { TreeViewer.RootNodes.Clear(); });
            var tags = new List<Cooktapi.Food.Tag>(Cooktapi.Food.Tag.Tags);
            //add root
            var rootTags = tags.FindAll((t) => { return t.ParentID == null; });
            foreach (Cooktapi.Food.Tag tag in rootTags)
            {
                tags.Remove(tag);

                await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { TreeViewer.RootNodes.Add(new TreeViewNode() { Content = tag }); });//
            }
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () =>
            {
                IList<TreeViewNode> unfinishedParents = new List<TreeViewNode>(TreeViewer.RootNodes);
                //other tags
                while (unfinishedParents.Count > 0)
                {
                    List<Tag> willRemoving = new List<Tag>();
                    foreach (Tag tag in tags)
                    {
                        if (tag.ParentID == (unfinishedParents[0].Content as Tag).ID)
                        {
                            willRemoving.Add(tag);
                            unfinishedParents[0].Children.Add(new TreeViewNode() { Content = tag });
                        }
                    }
                    foreach (Tag tag in willRemoving)
                    {
                        tags.Remove(tag);
                    }
                    unfinishedParents.Remove(unfinishedParents[0]);
                }
            });
        }

        private void Page_Loaded(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            Task.Run(async () => { await RefreshItems(); });
        }

        private async void TreeViewer_DragItemsCompleted(TreeView sender, TreeViewDragItemsCompletedEventArgs args)
        {
            TreeViewNode changed = args.Items[0] as TreeViewNode;
            TreeViewNode newParent = changed.Parent;
            Tag tag = changed.Content as Tag;

            tag.ParentID = (newParent?.Content as Tag)?.ID;
            await tag.Save();

        }

        private void TreeViewer_ItemInvoked(TreeView sender, TreeViewItemInvokedEventArgs args)
        {
            SelectedTag = (args.InvokedItem as TreeViewNode)?.Content as Tag;
        }
        private void SaveCurrentTagBTN_Click(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            Task.Run(async () =>
            {
                await SelectedTag.Save();
                await RefreshItems();
            });
        }

        private void DeleteTagBTN_Click(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            Task.Run(async () =>
            {
                await SelectedTag.Delete();
                await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { SelectedTag = null; });
                await RefreshItems();
            });
        }

        private void NewBTN_Click(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            Task.Run(async () =>
            {
                string guid = Guid.NewGuid().ToString();
                while (Cooktapi.Food.Tag.Tags.Find((t) => { return t.ID == guid; }) != null)
                {
                    guid = Guid.NewGuid().ToString();
                }
                Tag tag = await new Tag(null, Guid.NewGuid().ToString(), "Új tag").Save();
                await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { SelectedTag = tag; });
                await RefreshItems();
            });
        }
    }
}
