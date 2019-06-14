using Kukta.FrameWork;
using Kukta.Screens;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Animation;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace Kukta
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        // List of ValueTuple holding the Navigation Tag and the relative Navigation Page
        private readonly List<(string Tag, Type Page)> _pages = new List<(string Tag, Type Page)>
{
    ("home", typeof(CalendarPage)),
    ("calendar", typeof(CalendarPage)),
    ("templates", typeof(WeekTemplatePage)),
    ("categories", typeof(FoodCategories)),
    ("foods", typeof(FoodEditor)),
};

        public MainPage()
        {
            this.InitializeComponent();
            //SetContent(ContentType.CategorieEditor);
        }






        private void ContentFrame_NavigationFailed(object sender, NavigationFailedEventArgs e)
        {

        }

        private void NavView_SelectionChanged(NavigationView sender, NavigationViewSelectionChangedEventArgs args)
        {
            if (args.IsSettingsSelected == true)
            {
                NavView_Navigate("settings", null);
            }
            else if ((NavigationViewItem)args.SelectedItem != null)
            {
                if (((NavigationViewItem)args.SelectedItem).Tag.ToString() == "account")
                {
                    //do login
                    Networking.SignUpLogin();
                }
                else
                {
                    var navItemTag = ((NavigationViewItem)args.SelectedItem).Tag.ToString();
                    NavView_Navigate(navItemTag, null);
                }
            }
        }





        private void NavView_Navigate(string navItemTag, NavigationTransitionInfo transitionInfo)
        {
            Type _page = null;
            if (navItemTag == "settings")
            {
                _page = null;
            }
            else
            {
                var item = _pages.FirstOrDefault(p => p.Tag.Equals(navItemTag));
                _page = item.Page;
            }
            // Get the page type before navigation so you can prevent duplicate
            // entries in the backstack.
            var preNavPageType = ContentFrame.CurrentSourcePageType;

            // Only navigate if the selected page isn't currently loaded.
            if (!(_page is null) && !Type.Equals(preNavPageType, _page))
            {
                if (transitionInfo == null)
                    ContentFrame.Navigate(_page, null, transitionInfo);
                else
                    ContentFrame.Navigate(_page, null, transitionInfo);
            }
        }

        private async void Page_Loaded(object sender, RoutedEventArgs e)
        {
        }
    }
}
