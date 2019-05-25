using Kukta.FrameWork;
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
using Windows.UI.Xaml.Media.Animation;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Kukta.Screens
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class CalendarPage : Page
    {
        private DateTime StartDateTime;

        public string HeadTitle
        {
            get
            {
                return " | " + StartDateTime.ToString("MM.dd") + " - " + StartDateTime.AddDays(6).ToString("MM.dd");
            }
        }

        public void OpenWeek(DateTime dateTime, NavigationTransitionInfo info)
        {
            this.StartDateTime = dateTime.StartOfWeek(DayOfWeek.Monday);
            CalendarWeekFrame.Navigate(typeof(CalendarContentPage), dateTime.CutToDay(), info);
            WeekTemplateInfoTextBlock.Text = HeadTitle;
        }

        public CalendarPage()
        {
            this.InitializeComponent();
        }

        private void BackButtonClick(object sender, RoutedEventArgs e)
        {
            OpenWeek(StartDateTime.AddDays(-7), new SlideNavigationTransitionInfo());
        }

        private void ForwardButtonClick(object sender, RoutedEventArgs e)
        {
            OpenWeek(StartDateTime.AddDays(7), new SlideNavigationTransitionInfo());
        }

        private void Page_Loaded(object sender, RoutedEventArgs e)
        {
            OpenWeek(DateTime.Now, new SlideNavigationTransitionInfo());
        }
    }
}
