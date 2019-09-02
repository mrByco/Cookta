using System;
using Windows.UI.Xaml.Media.Animation;

namespace Kukta.UWPLayer
{
    public class NavigationHistoryItem
    {
        public NavigationHistoryItem(Type page, NavigationTransitionInfo navigationTransitionInfo, object parameter)
        {
            Page = page;
            NavigationTransitionInfo = navigationTransitionInfo;
            Parameter = parameter;
        }

        public Type Page { get; }
        public NavigationTransitionInfo NavigationTransitionInfo { get; }
        public object Parameter { get; }

    }
}