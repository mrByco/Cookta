using Kukta.Calendar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace Kukta.FrameWork
{
    class IMealingItemButton : Button
    {
        public IMealingItem Item;
        private Action<IMealingItem> OnClick;
        public IMealingItemButton(IMealingItem item, Action<IMealingItem> onClick) : base()
        {
            Item = item;
            base.Content = item.GetName();
            base.HorizontalAlignment = Windows.UI.Xaml.HorizontalAlignment.Stretch;
            base.HorizontalContentAlignment = Windows.UI.Xaml.HorizontalAlignment.Left;
            OnClick = onClick;
            base.Click += ButtonClick;
            base.Margin = new Thickness(0, 3, 0, 3);

        }
        private void ButtonClick(object sender, RoutedEventArgs e)
        {
            OnClick(Item);
        }
    }
}
