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

        private readonly ObservableCollection<Tag> m_ViewItems = new ObservableCollection<Tag>();
        private ObservableCollection<Tag> ViewItems { get { return m_ViewItems; } }
        public async Task RefreshItems()
        {

            //SetLoading
            await Cooktapi.Food.Tag.DownloadTags();
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { ViewItems.Clear(); });
            var tags = Cooktapi.Food.Tag.Tags;
            var tagsAdded = new List<Tag>();
            //first layer
            foreach (Cooktapi.Food.Tag tag in tags)
            {
                if (tag.ParentID == null)
                {
                    await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, () => { ViewItems.Add(tag); });
                    tagsAdded.Add(tag);
                }
            }
        }

        private void Page_Loaded(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            Task.Run(async () => { await RefreshItems(); });
        }

        private void TreeViewer_DragItemsCompleted(TreeView sender, TreeViewDragItemsCompletedEventArgs args)
        {
            List<Tag> changed = new List<Tag>();
            foreach (object item in args.Items)
            {
                changed.Add(item as Tag);
            }
        }
        //Gets the parent of the current tag, returns null if not exist or is root
        private string GetParentFromView(Tag tag)
        {
            List<TreeViewNode> CurrentParents = TreeViewer.RootNodes;
            foreach (TreeViewNode parent in CurrentParents)
        }
    }
}
