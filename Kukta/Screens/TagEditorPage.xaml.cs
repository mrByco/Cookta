using Cooktapi.Food;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
    public sealed partial class TagEditorPage : Page
    {
        public TagEditorPage()
        {
            this.InitializeComponent();
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
            await tag.ChangeTag(tag.Name, (newParent?.Content as Tag)?.ID);
            //changed.ParentID = GetParentFromView(changed);

        }
        //private string GetParentFromView(Tag tag)
        //{
        //    List<TreeViewNode> AllNodes = new List<TreeViewNode>();
        //    List<TreeViewNode> CurrentParents = new List<TreeViewNode>(TreeViewer.RootNodes);
        //    while (CurrentParents.Count > 0)
        //    {
        //        foreach (TreeViewNode node in CurrentParents[0].Children)
        //        {
        //            CurrentParents.Add(node);
        //        }
        //        AllNodes.Add(CurrentParents[0]);
        //        CurrentParents.Remove(CurrentParents[0]);
        //    }
        //    string parentID = (AllNodes.Find((n) => { return (n.Parent?.Content as Tag).ID == tag.ID; }).Content as Tag).ID;
        //    return parentID;
        //}
    }
}
