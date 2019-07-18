using Kukta.FoodFrameworkV2;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The User Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234236

namespace Kukta.UI
{
    public sealed partial class TagPanel : UserControl
    {
        public event TagsChangedEvent TagsChanged;
        public event TagClickEvent TagClick;
        public TagPanel()
        {
            this.InitializeComponent();
        }
        private ObservableCollection<VisibleTag> m_Tags = new ObservableCollection<VisibleTag>();
        public List<Tag> Tags
        {
            get
            {
                List<Tag> tags = new List<Tag>();
                foreach (VisibleTag tag in m_Tags.ToList())
                {
                    tags.Add(tag.original);
                }
                return tags;
            }
            set
            {
                m_Tags = new ObservableCollection<VisibleTag>();
                
                value.ForEach((tag) =>
                {
                    if (tag != null)
                    {
                        var vTag = new VisibleTag(tag);
                        vTag.IsInEditMode = EditEnabled;
                        m_Tags.Add(vTag);
                    }
                });
                TagContainer.ItemsSource = m_Tags;
            }
        }
        public bool DeleteEnabled;
        private bool m_EditEnabled = false;
        public bool EditEnabled
        {
            get
            {
                return m_EditEnabled;
            }
            set
            {
                m_EditEnabled = value;
                var tags = new List<Tag>();
                for (int i = 0; i < m_Tags.Count; i++)
                {
                    m_Tags[i].IsInEditMode = value;
                    tags.Add(m_Tags[i].original);
                }
                Tags = tags;
                TagAdder.Visibility = m_EditEnabled ? Visibility.Visible : Visibility.Collapsed;
            }
        }


        private void RaiseTagsChanged() { TagsChanged?.Invoke(this, Tags); }

        private void Tag_Click(object sender, RoutedEventArgs e)
        {
            this.TagClick?.Invoke(this, FoodFrameworkV2.Tag.GetTagByText((sender as Button).Tag as string));
        }

        private void DeleteButton_Click(object sender, RoutedEventArgs e)
        {
            VisibleTag tag = m_Tags.ToList().Find((vTag) => {return (sender as Button).Tag as string == vTag.AsString; });
            m_Tags.Remove(tag);
            RaiseTagsChanged();
        }

        private void TagAdder_QuerySubmitted(AutoSuggestBox sender, AutoSuggestBoxQuerySubmittedEventArgs args)
        {
            if (args.ChosenSuggestion != null)
            {
                var tags = Tags;
                tags.Add(args.ChosenSuggestion as Tag);
                Tags = tags;
                RaiseTagsChanged();
            }
        }

        private void TagAdder_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
        {
            if (args.Reason == AutoSuggestionBoxTextChangeReason.UserInput)
            {
                var filteredTags = FoodFrameworkV2.Tag.Tags.FindAll((tag) => { return tag.ToString().ToLower().Contains(sender.Text.ToLower()); });
                TagAdder.ItemsSource = filteredTags;
            }
            else if (args.Reason == AutoSuggestionBoxTextChangeReason.SuggestionChosen)
            {
                sender.Text = "";
                sender.IsSuggestionListOpen = false;
            }
        }

        private void TagAdder_SuggestionChosen(AutoSuggestBox sender, AutoSuggestBoxSuggestionChosenEventArgs args)
        {
            sender.Text = "";
            sender.IsSuggestionListOpen = false;
        }
    }
    public delegate void TagsChangedEvent(TagPanel panel, List<Tag> tags);
    public delegate void TagClickEvent(TagPanel panel, Tag tag);

    public class VisibleTag
    {
        public readonly Tag original;
        public VisibleTag(Tag original)
        {
            this.original = original;
        }
        public override string ToString()
        {
            return original.ToString();
        }
        public string AsString
        {
            get
            {
                return original.AsString;
            }
        }
        public Visibility EditVisibility
        {
            get
            {
                return IsInEditMode ? Visibility.Visible : Visibility.Collapsed;
            }
        }
        public bool IsInEditMode = false;
    }
}
