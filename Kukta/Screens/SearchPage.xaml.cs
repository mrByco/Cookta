using Cooktapi.Food;
using System;
using System.Collections.Generic;
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

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class SearchPage : Page
    {
        public SearchPage()
        {
            this.InitializeComponent();
        }
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            SearchParam param = e.Parameter as SearchParam;
            DoSearch(param ?? new SearchParam("", new List<Tag>()));
        }
        public void DoSearch(SearchParam parameter)
        {
            if (parameter.Text == null || parameter.Text == "")
            {
                string tags = "";
                parameter.Tags?.ForEach(tag =>
                {
                    if (tags.Length != 0) tags = tags + ",";
                    tags = tags + tag.ID;
                }
                );
                var args = new Dictionary<string, object>();
                if (tags.Length > 0)
                    args.Add("filter", tags);
                FoodPanel.ItemsSource = new UWPLayer.IncrementalFoodSource(EFoodSearchType.All, args, Dispatcher, 0);
            }
            else
            {
                if (SearchSuggestBox.Text != parameter.Text)
                    SearchSuggestBox.Text = parameter.Text;
                var args = new Dictionary<string, object>();
                args.Add("text", parameter.Text);
                FoodPanel.ItemsSource = new UWPLayer.IncrementalFoodSource(EFoodSearchType.FullText, args, Dispatcher, 0);
            }
        }

        private void AutoSuggestBox_QuerySubmitted(AutoSuggestBox sender, AutoSuggestBoxQuerySubmittedEventArgs args)
        {
            DoSearch(new SearchParam(args.QueryText, new List<Tag>()));
        }

        private void FoodPanel_OnItemClick(Food food)
        {
            MainPage.NavigateTo("fooddetail", null, food.Id);
        }
    }
    public class SearchParam
    {
        public string Text;
        public List<Tag> Tags;

        public SearchParam(string text, List<Tag> tags)
        {
            Text = text;
            Tags = tags;
        }
    }
}
